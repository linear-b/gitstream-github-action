/* eslint-disable import/no-commonjs */

module.exports = core => {
  const { IS_NON_COMMIT_ARG, ENABLE_CACHE_ARG, RUN_ID_ARG } = process.env
  try {
    core.info(`RUN_ID_ARG value ${RUN_ID_ARG}. type: ${ typeof RUN_ID_ARG }`) 
    const isRunIdExists = !!RUN_ID_ARG
    core.info(`isRunIdExists value ${isRunIdExists}. type: ${ typeof RUN_ID_ARG }`) 
    const skipGitClone =
      IS_NON_COMMIT_ARG === 'true' &&
      ENABLE_CACHE_ARG === 'true' &&
      isRunIdExists

    core.info(`skipGitClone value ${skipGitClone}. type: ${ typeof skipGitClone }`) 
    core.info(
      `IS_NON_COMMIT_ARG type: ${typeof IS_NON_COMMIT_ARG}. ENABLE_CACHE_ARG type: ${typeof ENABLE_CACHE_ARG}. isRunIdExists`
    )

    core.exportVariable('IS_NON_COMMIT_EVENT', IS_NON_COMMIT_ARG)
    core.exportVariable('SKIP_GIT_CLONE', skipGitClone.toString())
  } catch (error) {
    core.warn(`Failed to get condition variables: ${error.message}`)

    core.exportVariable('IS_NON_COMMIT_EVENT', 'false')
    core.exportVariable('SKIP_GIT_CLONE', 'false')
  }
}
