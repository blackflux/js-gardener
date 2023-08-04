import path from 'path';
import fs from 'smart-fs';

import { getTestFiles } from '../util.js';

// Check project structure
export default (logger, cwd, ignored) => (async () => {
  const notFoundFiles = getTestFiles(cwd)
    .filter((e) => ignored.indexOf(e) === -1)
    .map((f) => [f, path.join(cwd, f.replace(/^test([/\\].*?)([^/\\]*?).spec.js$/, 'src$1$2.js'))])
    .reduce((errors, [testFile, srcFile]) => {
      if (!fs.existsSync(srcFile) || !fs.lstatSync(srcFile).isFile()) {
        logger.error(`Expected file ${srcFile} to exist for ${testFile}`);
        errors.push(srcFile);
      }
      return errors;
    }, []);
  if (notFoundFiles.length !== 0) {
    throw new Error('struct failed');
  }
})();
