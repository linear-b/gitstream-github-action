/* eslint-disable import/no-commonjs */

module.exports = core => {
  try {
    const { ARTIFACT_OUTCOME_ARG, ARTIFACT_OUTCOME_CM_REPO_ARG } = process.env
    core.info(
      `ARTIFACT_OUTCOME_ARG Cache download status: ${ARTIFACT_OUTCOME_ARG}.`
    )
    core.info(
      `ARTIFACT_OUTCOME_CM_REPO_ARG Cache download status: ${ARTIFACT_OUTCOME_CM_REPO_ARG}.`
    )

    if (
      ARTIFACT_OUTCOME_ARG === 'failure' ||
      ARTIFACT_OUTCOME_CM_REPO_ARG === 'failure'
    ) {
      core.exportVariable('CACHE_DOWNLOAD_FAILED', 'true')
    } else {
      core.exportVariable('CACHE_DOWNLOAD_FAILED', 'false')
    }
  } catch (error) {
    core.warn(`Failed to set cache download status: ${error.message}`)
    core.exportVariable('CACHE_DOWNLOAD_FAILED', 'true')
  }
}
