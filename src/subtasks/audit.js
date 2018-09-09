const chalk = require("chalk");
const exec = require("./../util/exec");

const MAX_AGE_IN_SEC = {
  info: 60 * 60 * 24 * 7 * 52 * 3,
  low: 60 * 60 * 24 * 7 * 52,
  moderate: 60 * 60 * 24 * 7 * 3,
  high: 0,
  critical: 0
};

module.exports = (logger, cwd) => {
  const npmAvailable = exec.run('[ -x $(command -v npm) ] && echo true || echo false', cwd);
  if (npmAvailable !== "true") {
    logger.error("NPM unavailable.");
    return Promise.resolve();
  }
  const npmVersion = exec.run("npm --version", cwd);
  const npmVersionSplit = npmVersion.split(".").map(parseInt);
  if (npmVersionSplit.length !== 3 || npmVersionSplit[0] < 6 || (npmVersionSplit[0] === 6 && npmVersionSplit[1] < 1)) {
    logger.error(`Invalid NPM version (${npmVersion}).`);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => exec.run('npm audit --json', cwd, (err, out) => {
    const data = JSON.parse(out);
    let error = false;
    Object.values(data.advisories || {}).forEach((advisory) => {
      const create = Date.parse(advisory.created);
      const ageInSec = (new Date() - create) / 1000;
      const severity = advisory.severity;
      const timeToFailureInSec = MAX_AGE_IN_SEC[severity] - ageInSec;
      const timeToFailureInDays = (timeToFailureInSec / (60 * 60 * 24)).toFixed(2);
      let message = `Failure in ${timeToFailureInDays} days`;
      if (timeToFailureInSec < 0) {
        error = true;
        message = chalk.red("Failure");
      }
      logger.info(`${chalk.yellow("Warning:")} Problem of Severity "${severity}" detected. ${message}`);
    });
    if (error) {
      reject(new Error("Failure. Fixing npm audit required."));
    } else {
      resolve();
    }
  }));
};
