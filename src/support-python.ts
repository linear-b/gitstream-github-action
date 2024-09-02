import * as core from '@actions/core'
import { execSync } from 'child_process'

export const installBlack = async (): Promise<void> => {
  const setupBlackCmd = 'pip install black==24.4.2'

  try {
    core.debug(`run command: "${setupBlackCmd}"`)
    const blackOutput: string = execSync(setupBlackCmd).toString()
    core.debug(blackOutput)
  } catch (error) {
    if (error instanceof Error) {
      core.warning(`Failed to install black with command ${setupBlackCmd}`)
      core.warning(error)
    }
  }
}
