import * as core from '@actions/core'
import { RulesEngine } from '@linearb/gitstream-core'
import { version } from '@linearb/gitstream-core/package.json'
import { installBlack } from './support-python'

export async function run(): Promise<void> {
  await installBlack()

  try {
    core.info(`gitstream-core ${version}`)
    RulesEngine().run()
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

run()
