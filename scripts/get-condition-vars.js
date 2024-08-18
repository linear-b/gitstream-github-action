/* eslint-disable import/no-commonjs */

module.exports = core => {
  const { IS_NON_COMMIT_ARG, ENABLE_CACHE_ARG } = process.env
  try {
    const skipGitClone = IS_NON_COMMIT_ARG === 'true' && ENABLE_CACHE_ARG === 'true'

    core.exportVariable('IS_NON_COMMIT_EVENT', IS_NON_COMMIT_ARG)
    core.exportVariable('SKIP_GIT_CLONE', skipGitClone.toString())
  } catch (error) {
    core.setFailed(error.message)

    core.exportVariable('IS_NON_COMMIT_EVENT', 'false')
    core.exportVariable('SKIP_GIT_CLONE', 'false')
  }
}
