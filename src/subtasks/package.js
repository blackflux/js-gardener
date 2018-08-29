const path = require("path");
const merge = require('lodash.merge');
const defaultsDeep = require('lodash.defaultsdeep');
const mapValues = require('lodash.mapvalues');
const util = require("./../util");

// rewrite package.json
module.exports = (logger, cwd, config) => {
  const gitUrl = util.getGitUrl(cwd);
  const packageFile = path.join(cwd, 'package.json');
  const packageJson = util.readJsonFile(packageFile);
  const currentYear = (new Date()).getFullYear();
  const packageTemplate = JSON.parse(util
    .readTextFile(`${__dirname}/../templates/package.json`)
    .replace(/{{GIT_URL}}/g, gitUrl)
    .replace(/{{AUTHOR}}/g, config.author)
    .replace(/{{YEAR}}/g, currentYear)
    .replace(/{{LICENSE}}/g, config.license));
  const license = util.readTextFile(`${__dirname}/../templates/licenses/${config.license}`)
    .replace(/{{AUTHOR}}/g, config.author)
    .replace(/{{YEAR}}/g, currentYear);
  util.writeTextFile(path.join(cwd, 'LICENSE'), license);
  merge(packageJson, packageTemplate.force);
  defaultsDeep(packageJson, packageTemplate.defaults);
  ['dependencies', 'devDependencies'].forEach((deps) => {
    packageJson[deps] = mapValues(packageJson[deps], dep => dep.replace(/^\^/, ''));
  });
  util.writeTextFile(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);
  return Promise.resolve();
};
