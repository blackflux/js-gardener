const fs = require('fs');
const path = require('path');

const util = require('./../util');

// Check project structure
module.exports = (logger, cwd, ignored) => new Promise((resolve, reject) => {
  const notFoundFiles = util.getTestFiles(cwd)
    .filter((e) => ignored.indexOf(e) === -1)
    .map((f) => [f, path.join(cwd, f.replace(/^test([/\\].*?)([^/\\]*?).spec.js$/, 'src$1$2.js'))])
    .reduce((errors, [testFile, srcFile]) => {
      if (!fs.existsSync(srcFile) || !fs.lstatSync(srcFile).isFile()) {
        logger.error(`Expected file ${srcFile} to exist for ${testFile}`);
        errors.push(srcFile);
      }
      return errors;
    }, []);

  return notFoundFiles.length === 0 ? resolve() : reject();
});
