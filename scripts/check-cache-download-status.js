/* eslint-disable import/no-commonjs */

module.exports = core => {
  try {
    const { ARTIFACT_OUTCOME_ARG } = process.env
    core.info(`Setting cache download status to: ${ARTIFACT_OUTCOME_ARG}`)

    if (ARTIFACT_OUTCOME_ARG === 'failure') {
      core.exportVariable('CACHE_DOWNLOAD_FAILED', 'true')
    } else {
      core.exportVariable('CACHE_DOWNLOAD_FAILED', 'false')
    }
  } catch (error) {
    core.warn(`Failed to set cache download status: ${error.message}`)
    core.exportVariable('CACHE_DOWNLOAD_FAILED', 'true')
  }
}
