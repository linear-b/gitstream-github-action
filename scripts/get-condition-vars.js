/* eslint-disable import/no-commonjs */

module.exports = core => {
  const { CLIENT_PAYLOAD_ARG, ENABLE_CACHE_ARG } = process.env
  try {
    const payload = JSON.parse(CLIENT_PAYLOAD_ARG)
    core.info({ payload, ENABLE_CACHE_ARG })
    core.info(`yeela-debug get-condtion-vars types: payload.isNonCommitEvent type: ${typeof(payload.isNonCommitEvent)}, ENABLE_CACHE_ARG type: ${typeof(ENABLE_CACHE_ARG)}`)
    const isNonCommitEvent = payload.isNonCommitEvent === true
    const skipGitClone = isNonCommitEvent && ENABLE_CACHE_ARG === true
    core.exportVariable('IS_NON_COMMIT_EVENT', isNonCommitEvent.toString())
    core.exportVariable('SKIP_GIT_CLONE', skipGitClone.toString())
  } catch (error) {
    core.setFailed(error.message)
    core.exportVariable('IS_NON_COMMIT_EVENT', 'false')
    core.exportVariable('SKIP_GIT_CLONE', 'false')
  }
}
