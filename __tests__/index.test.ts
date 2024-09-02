import { run } from '../src/main'

jest.mock('../src/main')
jest.mock('@linearb/gitstream-core')

describe('index.ts', () => {
  const runMock = run as jest.MockedFunction<typeof run>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call run function', async () => {
    runMock.mockImplementation(async () => Promise.resolve())

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('../src/index')

    expect(runMock).toHaveBeenCalled()
  })
})
