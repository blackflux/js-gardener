const robo = require('robo-config');

module.exports = (logger, cwd) => (async () => {
  let result;
  try {
    result = robo(cwd);
  } catch (e) {
    logger.error(e.message);
    throw e;
  }
  result.forEach((l) => logger.error(l));
  if (result.length !== 0) {
    throw result;
  }
})();
