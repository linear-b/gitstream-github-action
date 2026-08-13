import { gzipSync } from 'zlib'

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const {
  run,
  toStepOutputs,
  normalizeForEngine
} = require('../scripts/resolve-payload-fields.js')
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

const RESOLVER_URL = 'https://resolver.example.com/api'

const payload = {
  githubToken: 'ghs_token',
  headHttpUrl: 'https://github.com/acme/repo.git',
  repoUrl: 'https://github.com/acme/other.git',
  owner: 'acme',
  hasCmRepo: true,
  cmRepo: 'cm-repo',
  cmRepoRef: 'main',
  hasCmOrg: false,
  cmOrgRef: ''
}

interface Core {
  info: jest.Mock
  setFailed: jest.Mock
  setSecret: jest.Mock
  setOutput: jest.Mock
}

const createCore = (): Core => ({
  info: jest.fn(),
  setFailed: jest.fn(),
  setSecret: jest.fn(),
  setOutput: jest.fn()
})

const outputsOf = (core: Core): Record<string, string> =>
  Object.fromEntries(core.setOutput.mock.calls)

const runWith = async (clientPayload: string): Promise<Core> => {
  const core = createCore()
  await run({ core, clientPayload, resolverUrl: RESOLVER_URL })
  return core
}

describe('toStepOutputs', () => {
  it('maps payload fields to string outputs', () => {
    expect(toStepOutputs(payload)).toEqual({
      github_token: 'ghs_token',
      url: 'https://github.com/acme/repo.git',
      has_cm_repo: 'true',
      cm_repository: 'acme/cm-repo',
      cm_repo_ref: 'main',
      has_cm_org: 'false',
      cm_org_ref: ''
    })
  })

  it('falls back to repoUrl and blanks the cm repo when absent', () => {
    expect(
      toStepOutputs({ repoUrl: 'https://github.com/acme/other.git' })
    ).toEqual({
      github_token: '',
      url: 'https://github.com/acme/other.git',
      has_cm_repo: 'false',
      cm_repository: '',
      cm_repo_ref: '',
      has_cm_org: 'false',
      cm_org_ref: ''
    })
  })
})

describe('run', () => {
  it('resolves a plain JSON payload', async () => {
    const core = await runWith(JSON.stringify(payload))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=plain')
    expect(outputsOf(core).url).toBe('https://github.com/acme/repo.git')
  })

  it('resolves a double-encoded JSON payload', async () => {
    const core = await runWith(JSON.stringify(JSON.stringify(payload)))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(outputsOf(core).cm_repository).toBe('acme/cm-repo')
  })

  it('inflates a gzipped payload', async () => {
    const compressed = gzipSync(JSON.stringify(payload)).toString('base64')
    const core = await runWith(compressed)

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=compressed')
    expect(outputsOf(core).cm_repo_ref).toBe('main')
  })

  it('masks the github token', async () => {
    const core = await runWith(JSON.stringify(payload))

    expect(core.setSecret).toHaveBeenCalledWith('ghs_token')
  })

  it('fails rather than inflating a decompression bomb', async () => {
    const bomb = gzipSync(Buffer.alloc(64 * 1024 * 1024, 0x61)).toString(
      'base64'
    )
    const core = await runWith(bomb)

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('refusing to expand it')
    )
  })

  it('inflates a wrapped compressed-payload envelope', async () => {
    const envelope = {
      type: 'compressed-payload',
      data: gzipSync(JSON.stringify(payload)).toString('base64'),
      pullRequestNumber: 123
    }
    const core = await runWith(JSON.stringify(JSON.stringify(envelope)))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith(
      'client_payload mode=compressed-envelope'
    )
    expect(outputsOf(core).cm_repository).toBe('acme/cm-repo')
  })

  it('fails loudly when a compressed-payload envelope has no gzip data', async () => {
    const core = await runWith(
      JSON.stringify(
        JSON.stringify({ type: 'compressed-payload', data: 'not-gzip' })
      )
    )

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('carries no gzip data')
    )
  })

  it('treats a raw payload carrying its own type as a raw payload', async () => {
    const core = await runWith(JSON.stringify({ ...payload, type: 'push' }))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=plain')
    expect(outputsOf(core).github_token).toBe('ghs_token')
    expect(outputsOf(core).cm_repository).toBe('acme/cm-repo')
  })

  it('fails on a payload that is not valid JSON', async () => {
    const core = await runWith('not json')

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Failed resolving client payload')
    )
  })
})

describe('run with an oversized-payload reference', () => {
  const reference = {
    type: 'oversized-payload-reference',
    payloadUrl: 'https://resolver.example.com/payloads/1',
    resolverToken: 'resolver_token'
  }

  const mockFetch = (response: Partial<Response>): jest.Mock => {
    const fetchMock = jest.fn().mockResolvedValue(response)
    global.fetch = fetchMock
    return fetchMock
  }

  it('fetches the stashed payload from the resolver origin', async () => {
    const fetchMock = mockFetch({
      ok: true,
      text: async () => JSON.stringify(payload)
    })

    const core = await runWith(JSON.stringify(reference))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=reference')
    expect(core.setSecret).toHaveBeenCalledWith('resolver_token')
    expect(fetchMock).toHaveBeenCalledWith(
      new URL(reference.payloadUrl),
      expect.objectContaining({
        headers: { Authorization: 'Bearer resolver_token' }
      })
    )
    expect(outputsOf(core).cm_repository).toBe('acme/cm-repo')
  })

  it('fetches from a double-encoded reference envelope', async () => {
    const fetchMock = mockFetch({
      ok: true,
      text: async () => JSON.stringify(payload)
    })

    const core = await runWith(JSON.stringify(JSON.stringify(reference)))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=reference')
    expect(fetchMock).toHaveBeenCalled()
    expect(outputsOf(core).cm_repository).toBe('acme/cm-repo')
  })

  it('inflates a stashed payload that is gzipped', async () => {
    mockFetch({
      ok: true,
      text: async () => gzipSync(JSON.stringify(payload)).toString('base64')
    })

    const core = await runWith(JSON.stringify(reference))

    expect(core.setFailed).not.toHaveBeenCalled()
    expect(outputsOf(core).cm_repo_ref).toBe('main')
  })

  it('fails loudly when the stash returns neither gzip nor JSON', async () => {
    // The stash holds the payload, not the envelope, and its form depends on
    // whether compression won: bare base64(gzip) if it did, raw JSON if not.
    // Anything else must be an error rather than a fall-through.
    mockFetch({ ok: true, text: async () => 'not-json-not-gzip' })

    const core = await runWith(JSON.stringify(reference))

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('Failed resolving client payload')
    )
  })

  it('names the offending URL when payloadUrl is not absolute', async () => {
    const fetchMock = mockFetch({ ok: true, text: async () => '{}' })

    const core = await runWith(
      JSON.stringify({
        ...reference,
        payloadUrl: '/api/v1/gitstream/payload/k'
      })
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('stashed payload URL is not absolute')
    )
  })

  it('refuses an origin other than the resolver', async () => {
    const fetchMock = mockFetch({ ok: true, text: async () => '{}' })

    const core = await runWith(
      JSON.stringify({
        ...reference,
        payloadUrl: 'http://169.254.169.254/latest/meta-data'
      })
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('refusing to fetch stashed payload')
    )
  })

  it('sends the request to the resolver host, not one named by the path', async () => {
    const fetchMock = mockFetch({
      ok: true,
      text: async () => JSON.stringify(payload)
    })

    await runWith(
      JSON.stringify({
        ...reference,
        payloadUrl: 'https://resolver.example.com//evil.example.com/x'
      })
    )

    const [requested] = fetchMock.mock.calls[0]
    expect(requested.host).toBe('resolver.example.com')
  })

  it('fails clearly when resolver_url is not set', async () => {
    const fetchMock = mockFetch({ ok: true, text: async () => '{}' })
    const core = createCore()

    await run({
      core,
      clientPayload: JSON.stringify(reference),
      resolverUrl: ''
    })

    expect(fetchMock).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('resolver_url is not set')
    )
  })

  it('fails when the stash responds with an error', async () => {
    mockFetch({ ok: false, status: 404 })

    const core = await runWith(JSON.stringify(reference))

    expect(core.setFailed).toHaveBeenCalledWith(
      expect.stringContaining('stashed payload fetch returned 404')
    )
  })

  it('treats a payload that merely mentions the marker as a regular payload', async () => {
    const fetchMock = mockFetch({ ok: true, text: async () => '{}' })

    const core = await runWith(
      JSON.stringify({ ...payload, cmRepoRef: 'oversized-payload-reference' })
    )

    expect(fetchMock).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('client_payload mode=plain')
    expect(outputsOf(core).cm_repo_ref).toBe('oversized-payload-reference')
  })
})

describe('normalizeForEngine', () => {
  const blob = gzipSync(Buffer.from(JSON.stringify(payload))).toString('base64')
  const reference = {
    type: 'oversized-payload-reference',
    payloadUrl: 'https://resolver.example.com/api/v1/gitstream/payload/key',
    resolverToken: 'token',
    pullRequestNumber: 7
  }

  it.each([
    ['plain, double-encoded', JSON.stringify(JSON.stringify(payload))],
    ['plain, single-encoded', JSON.stringify(payload)],
    ['bare base64(gzip)', blob]
  ])('passes %s through byte-identical', (_label, raw) => {
    expect(normalizeForEngine(raw)).toBe(raw)
  })

  it('hands core the bare blob out of a compressed-payload envelope', () => {
    const wrapped = JSON.stringify(
      JSON.stringify({
        type: 'compressed-payload',
        data: blob,
        pullRequestNumber: 7
      })
    )

    expect(normalizeForEngine(wrapped)).toBe(blob)
  })

  it('hands core a single-encoded reference, which is the depth it parses', () => {
    const wrapped = JSON.stringify(JSON.stringify(reference))
    const normalized = normalizeForEngine(wrapped)

    expect(JSON.parse(normalized)).toEqual(reference)
  })

  it('leaves a payload that merely carries a type field alone', () => {
    const raw = JSON.stringify(JSON.stringify({ ...payload, type: 'push' }))

    expect(normalizeForEngine(raw)).toBe(raw)
  })

  it('emits the normalized payload as a step output', async () => {
    const core = await runWith(
      JSON.stringify(JSON.stringify({ type: 'compressed-payload', data: blob }))
    )

    expect(outputsOf(core).client_payload).toBe(blob)
  })
})
