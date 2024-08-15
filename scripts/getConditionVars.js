/* eslint-disable-next-line import/no-commonjs */
module.exports = core => {
  const {CLIENT_PAYLOAD_ARG, ENABLE_CACHE_ARG} = process.env
  try {
    const payload = JSON.parse(CLIENT_PAYLOAD_ARG)
    const isNonCommitEvent = payload.isNonCommitEvent == true
    const skipGitClone = isNonCommitEvent && ENABLE_CACHE_ARG == 'true'
    core.exportVariable('IS_NON_COMMIT_EVENT', isNonCommitEvent.toString())
    core.exportVariable('SKIP_GIT_CLONE', skipGitClone)
  } catch (error) {
    core.setFailed(error.message)
    core.exportVariable('IS_NON_COMMIT_EVENT', 'false')
    core.exportVariable('SKIP_GIT_CLONE', false)
  }
}
