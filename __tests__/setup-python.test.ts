import * as core from '@actions/core'
import { execSync } from 'child_process'
import { installBlack } from '../src/support-python'

jest.mock('@actions/core')
jest.mock('child_process')

describe('installBlack', () => {
  const debugMock = jest.spyOn(core, 'debug')
  const warningMock = jest.spyOn(core, 'warning')
  const execSyncMock = execSync as jest.MockedFunction<typeof execSync>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should install black successfully', async () => {
    execSyncMock.mockReturnValue('Successfully installed black')

    await installBlack()

    expect(debugMock).toHaveBeenCalledWith(
      'run command: "pip install black==24.4.2"'
    )
    expect(debugMock).toHaveBeenCalledWith('Successfully installed black')
    expect(warningMock).not.toHaveBeenCalled()
  })

  it('should handle errors correctly', async () => {
    execSyncMock.mockImplementation(() => {
      throw new Error('Failed to install black')
    })

    await installBlack()

    expect(debugMock).toHaveBeenCalledWith(
      'run command: "pip install black==24.4.2"'
    )
    expect(warningMock).toHaveBeenCalledWith(
      'Failed to install black with command pip install black==24.4.2'
    )
    expect(warningMock).toHaveBeenCalledWith(expect.any(Error))
  })
})
