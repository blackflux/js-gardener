const fs = require('fs');
const yaml = require('js-yaml');

module.exports = (logger, cwd, files) => new Promise((resolve, reject) => {
  let result = true;
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    try {
      yaml.loadAll(content, () => {}, { schema: yaml.DEFAULT_SAFE_SCHEMA });
    } catch (e) {
      logger.error(`An error has occurred in: ${file}`);
      logger.error(e.message);
      result = false;
    }
  });
  return result ? resolve() : reject();
});
