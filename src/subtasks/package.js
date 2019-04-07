const path = require('path');
const get = require('lodash.get');
const merge = require('lodash.merge');
const defaultsDeep = require('lodash.defaultsdeep');
const mapValues = require('lodash.mapvalues');
const util = require('./../util');

// rewrite package.json
module.exports = (logger, cwd) => {
  const gitUrl = util.getGitUrl(cwd);
  const packageFile = path.join(cwd, 'package.json');
  const packageJson = util.readJsonFile(packageFile);
  const packageTemplate = JSON.parse(util
    .readTextFile(`${__dirname}/../templates/package.json`)
    .replace(/{{GIT_URL}}/g, gitUrl));
  merge(packageJson, packageTemplate.force);
  defaultsDeep(packageJson, packageTemplate.defaults);
  ['dependencies', 'devDependencies'].forEach((deps) => {
    packageJson[deps] = mapValues(packageJson[deps], dep => dep.replace(/^\^/, ''));
  });
  if ([
    'chai',
    'coveralls',
    'nyc',
    'semantic-release',
    'js-gardener'
  ].some(d => packageJson.dependencies[d] !== undefined)) {
    const msg = 'Designated devDependencies found in package->dependencies';
    logger.error(msg);
    throw new Error(msg);
  }
  if (!get(packageJson, 'repository.url', '').startsWith('https://')) {
    const msg = 'Repository Url required to start with https://';
    logger.error(msg);
    throw new Error(msg);
  }
  util.writeTextFile(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
  return Promise.resolve();
};
