const fs = require('fs');
const path = require('path');

const util = require(`./../util`);

// Check project structure
module.exports = (logger, cwd, ignored) => new Promise((resolve, reject) => {
  const notFoundFiles = util.getTestFiles(cwd)
    .filter(e => ignored.indexOf(e) === -1)
    .map(f => [f, path.join(cwd, f.replace(/^test(.*?[/\\])test_([^/\\]*?.js)$/, 'lib$1$2'))])
    .reduce((errors, [testFile, libFile]) => {
      if (!fs.existsSync(libFile) || !fs.lstatSync(libFile).isFile()) {
        logger.error(`Expected file ${libFile} to exist for ${testFile}`);
        errors.push(libFile);
      }
      return errors;
    }, []);

  return notFoundFiles.length === 0 ? resolve() : reject();
});
