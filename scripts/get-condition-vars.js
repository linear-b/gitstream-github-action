/* eslint-disable import/no-commonjs */

module.exports = core => {
  const { IS_NON_COMMIT_ARG, ENABLE_CACHE_ARG, RUN_ID_ARG } = process.env
  try {
    const isRunIdExists = !!RUN_ID_ARG

    const skipGitClone =
      IS_NON_COMMIT_ARG === 'true' &&
      ENABLE_CACHE_ARG === 'true' &&
      isRunIdExists

    core.exportVariable('IS_NON_COMMIT_EVENT', IS_NON_COMMIT_ARG)
    core.exportVariable('SKIP_GIT_CLONE', skipGitClone.toString())
  } catch (error) {
    core.warn(`Failed to get condition variables: ${error.message}`)

    core.exportVariable('IS_NON_COMMIT_EVENT', 'false')
    core.exportVariable('SKIP_GIT_CLONE', 'false')
  }
}
