const fs = require('fs-extra');
const get = require('lodash.get');
const path = require('path');
const globSync = require('glob').sync;

// create folder and dirs, return created
module.exports = (logger, targetFolder, config) => {
  const fromFolder = path.join(__dirname, '..', 'templates', 'files');
  const created = [];
  const toSkip = get(config, 'skip', []);
  globSync('**/*', { cwd: fromFolder, dot: true })
    .map(f => [
      f,
      f.replace(/(^|\/)dot\./, '$1.')
    ])
    .map(([origin, target]) => [
      origin,
      target,
      path.join(fromFolder, origin),
      path.join(targetFolder, target)
    ])
    .filter(f => toSkip.indexOf(f[1]) === -1)
    .forEach(([origin, target, fromFile, toFile]) => {
      if (!fs.existsSync(toFile)) {
        if (fs.existsSync(fromFile) && fs.lstatSync(fromFile).isFile()) {
          fs.copySync(fromFile, toFile);
        } else {
          fs.mkdirSync(toFile);
        }
        created.push(origin);
      }
    });
  if (created.length !== 0) {
    logger.info(created);
  }
  return Promise.resolve();
};
