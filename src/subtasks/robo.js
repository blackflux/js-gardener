const path = require('path');
const robo = require('robo-config');

module.exports = (logger, cwd) => new Promise((resolve, reject) => {
  const result = robo(path.join(cwd, '.roboconfig.json'));
  result.forEach(l => logger.error(l));
  return result.length === 0 ? resolve() : reject();
});
