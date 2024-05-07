const core = require('@actions/core');
const { RulesEngine } = require('@linearb/gitstream-core');
const { execSync } = require('child_process');
const { version } = require('@linearb/gitstream-core/package.json');

async function run() {
  try {
    const setupBlackCmd = 'pip install black==24.4.2';
    core.debug(`run command: "${setupBlackCmd}"`);
    const blackOutput = execSync(setupBlackCmd).toString();
    core.debug(blackOutput);
  } catch (error) {
    core.warning(`Failed to install black with command ${setupBlackCmd}`, error);
  }

  try {
    core.info(`gitstream-core ${version}`);
    RulesEngine().run();
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
