/**
 * Resolves the `client_payload` input of action.yml into the individual fields
 * that later steps consume.
 *
 * The payload reaches the action in one of three shapes:
 *   - plain      JSON (possibly double-encoded as a JSON string)
 *   - compressed base64(gzip(JSON))
 *   - reference  small JSON pointing at a payload stashed on the resolver,
 *                used when the payload is too large to pass through GitHub
 *
 * Only the fields needed by YAML step expressions are resolved here.
 * CLIENT_PAYLOAD itself is passed to the rules engine untouched - the engine
 * inflates it, which keeps the large inflated payload off the runner's env.
 */

const { gunzipSync } = require('zlib');

const OVERSIZED_PAYLOAD_REFERENCE = 'oversized-payload-reference';
const COMPRESSED_PAYLOAD = 'compressed-payload';
const PAYLOAD_FETCH_TIMEOUT_MS = 10000;

// Bounds a decompression bomb: gzip is asymmetric, so a small input can inflate
// far enough to exhaust the runner.
const MAX_INFLATED_PAYLOAD_BYTES = 32 * 1024 * 1024;

function inflateIfGzipped(value) {
  const buffer = Buffer.from(value, 'base64');
  const isGzip = buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
  if (!isGzip) {
    return null;
  }
  try {
    return gunzipSync(buffer, {
      maxOutputLength: MAX_INFLATED_PAYLOAD_BYTES,
    }).toString('utf8');
  } catch (err) {
    if (err.code === 'ERR_BUFFER_TOO_LARGE') {
      throw new Error(
        `payload inflates beyond ${MAX_INFLATED_PAYLOAD_BYTES} bytes; refusing to expand it`,
      );
    }
    throw new Error(`gzip decompression failed: ${err.message}`);
  }
}

// Parses JSON that may have been encoded twice.
function parsePayload(value) {
  const parsed = JSON.parse(value);
  return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
}

// Returns the parsed value, or null when `raw` is not JSON at all - the bare
// base64(gzip) form, which has no envelope around it.
function tryParsePayload(raw) {
  try {
    const parsed = parsePayload(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Builds the stash URL on the resolver's own origin.
 *
 * The reference names a URL to fetch, but it arrives inside client_payload, so
 * that URL is attacker-influenced. The host in `payloadUrl` is decorative and
 * is discarded - always, not only when it disagrees. Only the path and query
 * are carried over, re-attached to resolver_url, which comes from the workflow
 * rather than the payload. That makes this structurally immune to being
 * redirected through this field, so please do not "fix" it later by honouring
 * the payload's host.
 *
 * The path is applied via the `pathname` setter rather than by resolving it as
 * a relative URL: relative resolution would let a `//host/...` path escape to
 * another origin.
 */
function stashUrl(payloadUrl, resolverUrl) {
  if (!resolverUrl) {
    throw new Error(
      'resolver_url is not set; cannot validate the stashed payload origin',
    );
  }
  const resolverOrigin = new URL(resolverUrl).origin;
  let requested;
  try {
    // The trigger always sends an absolute URL; both it and resolver_url are
    // built from the same base, so a relative one means that base was empty.
    requested = new URL(payloadUrl);
  } catch {
    throw new Error(
      `stashed payload URL is not absolute: ${payloadUrl} - the resolver's public API base is probably unset`,
    );
  }
  if (requested.origin !== resolverOrigin) {
    throw new Error(
      `refusing to fetch stashed payload from ${requested.origin}; expected ${resolverOrigin}`,
    );
  }
  const url = new URL(resolverOrigin);
  url.pathname = requested.pathname;
  url.search = requested.search;
  return url;
}

async function fetchStashedPayload(reference, resolverUrl, core) {
  const url = stashUrl(reference.payloadUrl, resolverUrl);
  core.setSecret(reference.resolverToken);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${reference.resolverToken}` },
    signal: AbortSignal.timeout(PAYLOAD_FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`stashed payload fetch returned ${response.status}`);
  }
  const body = await response.text();
  return parsePayload(inflateIfGzipped(body) ?? body);
}

/**
 * Resolves whichever shape the trigger sent. Both compressed forms are
 * permanent, not a migration step: GitHub wraps the payload in an envelope so
 * that `run-name`, which is evaluated before any step exists and so cannot be
 * rescued from here, still parses. Bitbucket has no `run-name` and keeps
 * sending the bare form.
 */
async function resolvePayload(raw, resolverUrl, core) {
  const parsed = tryParsePayload(raw);
  if (parsed) {
    // Switch on the *value* of `type`, never its presence: a raw payload may
    // legitimately carry its own `type` (Bitbucket builds it from the webhook
    // context), and must fall through to the raw branch below.
    if (parsed.type === OVERSIZED_PAYLOAD_REFERENCE) {
      const payload = await fetchStashedPayload(parsed, resolverUrl, core);
      return { mode: 'reference', payload };
    }
    if (parsed.type === COMPRESSED_PAYLOAD) {
      const inflated = inflateIfGzipped(parsed.data || '');
      if (inflated === null) {
        throw new Error(`${COMPRESSED_PAYLOAD} envelope carries no gzip data`);
      }
      return { mode: 'compressed-envelope', payload: parsePayload(inflated) };
    }
    return { mode: 'plain', payload: parsed };
  }
  const inflated = inflateIfGzipped(raw);
  if (inflated !== null) {
    return { mode: 'compressed', payload: parsePayload(inflated) };
  }
  // Not JSON and not gzip - let the JSON error describe what arrived.
  return { mode: 'plain', payload: parsePayload(raw) };
}

/**
 * Maps a resolved payload to the step outputs v1's action.yml consumes. Output
 * values are strings, so booleans are stringified to be compared as `== 'true'`
 * in step conditions.
 */
/**
 * @param {string} raw the `client_payload` input, verbatim
 * @returns {string} the form gitstream-core already understands
 */
function normalizeForEngine(raw) {
  const envelope = tryParsePayload(raw);
  if (!envelope) {
    // Bare base64(gzip), which the engine inflates on its own.
    return raw;
  }
  if (envelope.type === COMPRESSED_PAYLOAD && envelope.data) {
    return envelope.data;
  }
  if (envelope.type === OVERSIZED_PAYLOAD_REFERENCE) {
    return JSON.stringify(envelope);
  }
  return raw;
}

function toStepOutputs(payload) {
  const hasCmRepo = payload.hasCmRepo === true;
  return {
    github_token: payload.githubToken || '',
    url: payload.headHttpUrl || payload.repoUrl || '',
    has_cm_repo: String(hasCmRepo),
    cm_repository: hasCmRepo ? `${payload.owner}/${payload.cmRepo}` : '',
    cm_repo_ref: payload.cmRepoRef || '',
  };
}

module.exports = async core => {
  const { PAYLOAD_ARG, RESOLVER_URL_ARG } = process.env;

  try {
    const { mode, payload } = await resolvePayload(
      PAYLOAD_ARG || '',
      RESOLVER_URL_ARG,
      core,
    );
    core.info(`client_payload mode=${mode}`);

    const outputs = {
      ...toStepOutputs(payload),
      client_payload: normalizeForEngine(PAYLOAD_ARG || ''),
    };
    // The installation token rides inside client_payload, so mask it before it
    // reaches an output or a later step's env dump.
    if (outputs.github_token) {
      core.setSecret(outputs.github_token);
    }
    for (const [name, value] of Object.entries(outputs)) {
      core.setOutput(name, value);
    }
  } catch (err) {
    core.setFailed(`Failed resolving client payload: ${err}`);
  }
};

module.exports.toStepOutputs = toStepOutputs;
module.exports.normalizeForEngine = normalizeForEngine;
