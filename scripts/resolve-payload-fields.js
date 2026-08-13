/**
 * Resolves the `client_payload` input of action.yml into the individual fields
 * that later steps consume.
 *
 * The payload reaches the action in one of three shapes:
 *   - plain     JSON (possibly double-encoded as a JSON string)
 *   - compressed base64(gzip(JSON))
 *   - reference  small JSON pointing at a payload stashed on the resolver,
 *                used when the payload is too large to pass through GitHub
 *
 * Run from the `Resolve payload fields` step via actions/github-script.
 */

const { gunzipSync } = require('zlib')

const OVERSIZED_PAYLOAD_REFERENCE = 'oversized-payload-reference'
const PAYLOAD_FETCH_TIMEOUT_MS = 10000

// 32MB
const MAX_INFLATED_PAYLOAD_BYTES = 32 * 1024 * 1024

/**
 * @param {string} value
 * @returns {string | null} the inflated text, or null if `value` is not gzip
 */
function inflateIfGzipped(value) {
  const buffer = Buffer.from(value, 'base64')
  const isGzip = buffer.length >= 2 && buffer[0] === 0x1f && buffer[1] === 0x8b
  if (!isGzip) {
    return null
  }
  try {
    return gunzipSync(buffer, {
      maxOutputLength: MAX_INFLATED_PAYLOAD_BYTES
    }).toString('utf8')
  } catch (err) {
    if (err.code === 'ERR_BUFFER_TOO_LARGE') {
      throw new Error(
        `payload inflates beyond ${MAX_INFLATED_PAYLOAD_BYTES} bytes; refusing to expand it`,
        { cause: err }
      )
    }
    throw new Error(`gzip decompression failed: ${err.message}`, { cause: err })
  }
}

/** Parses JSON that may have been encoded twice. */
function parsePayload(value) {
  const parsed = JSON.parse(value)
  return typeof parsed === 'string' ? JSON.parse(parsed) : parsed
}

/**
 * @returns {object | null} the stash reference, or null for a regular payload
 */
function readStashReference(raw) {
  // Cheap pre-check so a regular payload is only parsed once, further down.
  if (!raw.includes(OVERSIZED_PAYLOAD_REFERENCE)) {
    return null
  }
  const parsed = parsePayload(raw)
  return parsed && parsed.type === OVERSIZED_PAYLOAD_REFERENCE ? parsed : null
}

/**
 * The stash is served by the same host as the resolver, so require that origin
 * rather than fetching whatever the payload names. Without this a crafted
 * client_payload could aim the runner at an internal address, which matters
 * most on self-hosted runners.
 */
function assertResolverOrigin(payloadUrl, resolverUrl) {
  const expectedOrigin = new URL(resolverUrl || '').origin
  const payloadOrigin = new URL(payloadUrl).origin
  if (payloadOrigin !== expectedOrigin) {
    throw new Error(
      `refusing to fetch stashed payload from ${payloadOrigin}; expected ${expectedOrigin}`
    )
  }
}

async function fetchStashedPayload(reference, resolverUrl, core) {
  assertResolverOrigin(reference.payloadUrl, resolverUrl)
  core.setSecret(reference.resolverToken)
  const response = await fetch(reference.payloadUrl, {
    headers: { Authorization: `Bearer ${reference.resolverToken}` },
    signal: AbortSignal.timeout(PAYLOAD_FETCH_TIMEOUT_MS)
  })
  if (!response.ok) {
    throw new Error(`stashed payload fetch returned ${response.status}`)
  }
  const body = await response.text()
  return parsePayload(inflateIfGzipped(body) ?? body)
}

/**
 * @returns {Promise<{ mode: string, payload: object }>}
 */
async function resolvePayload(raw, resolverUrl, core) {
  const reference = readStashReference(raw)
  if (reference) {
    const payload = await fetchStashedPayload(reference, resolverUrl, core)
    return { mode: 'reference', payload }
  }
  const inflated = inflateIfGzipped(raw)
  if (inflated !== null) {
    return { mode: 'compressed', payload: parsePayload(inflated) }
  }
  return { mode: 'plain', payload: parsePayload(raw) }
}

/**
 * Maps a resolved payload to the step outputs. Output values are strings, so
 * booleans are stringified to be compared as `== 'true'` in step conditions.
 */
function toStepOutputs(payload) {
  const hasCmRepo = payload.hasCmRepo === true
  return {
    github_token: payload.githubToken || '',
    url: payload.headHttpUrl || payload.repoUrl || '',
    has_cm_repo: String(hasCmRepo),
    cm_repository: hasCmRepo ? `${payload.owner}/${payload.cmRepo}` : '',
    cm_repo_ref: payload.cmRepoRef || '',
    has_cm_org: String(payload.hasCmOrg === true),
    cm_org_ref: payload.cmOrgRef || ''
  }
}

async function run({ core, clientPayload, resolverUrl }) {
  try {
    const { mode, payload } = await resolvePayload(
      clientPayload || '',
      resolverUrl,
      core
    )
    core.info(`client_payload mode=${mode}`)

    const outputs = toStepOutputs(payload)

    if (outputs.github_token) {
      core.setSecret(outputs.github_token)
    }
    for (const [name, value] of Object.entries(outputs)) {
      core.setOutput(name, value)
    }
  } catch (err) {
    core.setFailed(`Failed resolving client payload: ${err}`)
  }
}

module.exports = {
  run,
  toStepOutputs
}
