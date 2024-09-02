import * as core from '@actions/core'
import { RulesEngine } from '@linearb/gitstream-core'
import { run } from '../src/main'
import { version } from '@linearb/gitstream-core/package.json'

jest.mock('@actions/core')
jest.mock('@linearb/gitstream-core')
jest.mock('../src/support-python', () => ({ installBlack: jest.fn() }))

describe('run', () => {
  const infoMock = jest.spyOn(core, 'info')
  const setFailedMock = jest.spyOn(core, 'setFailed')
  const rulesEngineMock = RulesEngine as jest.MockedFunction<typeof RulesEngine>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should run RulesEngine successfully', async () => {
    // @ts-expect-error RulesEngine implement 3 more methods
    rulesEngineMock.mockReturnValue({ run: jest.fn() })

    await run()

    expect(infoMock).toHaveBeenCalledWith(`gitstream-core ${version}`)
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    rulesEngineMock.mockImplementation(() => {
      throw new Error('Failed to run RulesEngine')
    })

    await run()

    expect(infoMock).toHaveBeenCalledWith(`gitstream-core ${version}`)
    expect(setFailedMock).toHaveBeenCalledWith('Failed to run RulesEngine')
  })
})
