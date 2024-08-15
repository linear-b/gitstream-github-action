module.exports = core => {
  const CLIENT_PAYLOAD_ARG = process.env.CLIENT_PAYLOAD_ARG
  try {
    const payload = JSON.parse(CLIENT_PAYLOAD_ARG)
    const isNonCommitEvent = payload.isNonCommitEvent || false
    core.exportVariable('IS_NON_COMMIT_EVENT', isNonCommitEvent)
  } catch (error) {
    core.setFailed(error.message)
    core.exportVariable('IS_NON_COMMIT_EVENT', false)
  }
}
