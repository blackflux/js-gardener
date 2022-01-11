const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = (logger, cwd, files) => (async () => {
  let result = true;
  files.forEach((file) => {
    const content = fs.readFileSync(path.join(cwd, file), 'utf-8');
    try {
      yaml.loadAll(content, () => {}, { schema: yaml.DEFAULT_SAFE_SCHEMA });
    } catch (e) {
      logger.error(`An error has occurred in: ${file}`);
      logger.error(e.message);
      result = false;
    }
  });
  if (!result) {
    throw new Error('yamllint failed');
  }
})();
