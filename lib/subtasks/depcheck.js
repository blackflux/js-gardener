const util = require("./../util");

module.exports = (logger, dir) => new Promise((resolve, reject) => {
  const depInfo = util.getNpmDependencies(dir);
  const success = depInfo[1] === "" && (depInfo[0].problems || []).length === 0;
  if (!success) {
    logger.error(depInfo[1]);
    logger.error(depInfo[0].problems);
  }
  return success ? resolve() : reject();
});
