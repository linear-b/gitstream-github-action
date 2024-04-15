module.exports = core => {
  const { RUNNER_OS, UPDATE_TIMES_A_DAY } = process.env;

  if (!UPDATE_TIMES_A_DAY) {
    return;
  }

  // calculate the docker-key cache value
  const times = Number(UPDATE_TIMES_A_DAY);

  if (!Number.isInteger(times) || times <= 0 || times >= 25) {
    core.error(`"update_times_a_day" should be a whole number in range [1..24]`);
    process.exit(2);
  }

  const date = new Date();
  const uniqNum = Math.ceil(((date.getHours() + 1) / 24) * times);
  const uniqValue = `${date.toLocaleDateString('en-US').replaceAll('/', '-')}-${uniqNum}`;
  const dockerKey = `${RUNNER_OS}-gitstream-docker-${uniqValue}`;
  core.exportVariable('DOCKER_KEY', dockerKey);
};
