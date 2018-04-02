const fs = require('fs');
const yaml = require('js-yaml');

module.exports = (grunt, cwd, files) => {
  let result = true;
  files.forEach((file) => {
    const content = fs.readFileSync(file, 'utf-8');
    try {
      yaml.loadAll(content, () => {}, { schema: yaml.DEFAULT_SAFE_SCHEMA });
    } catch (e) {
      grunt.log.error([`An error has occurred in: ${file}`]);
      grunt.log.error([e.message]);
      result = false;
    }
  });
  return Promise.resolve(result);
};
