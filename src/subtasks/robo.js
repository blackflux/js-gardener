const robo = require('robo-config');

module.exports = (logger, cwd) => new Promise((resolve, reject) => {
  try {
    const result = robo(cwd);
    result.forEach(l => logger.error(l));
    return result.length === 0 ? resolve() : reject(result);
  } catch (e) {
    logger.error(e);
    return reject(e);
  }
});
