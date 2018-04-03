const fs = require("fs");
const log = require("fancy-log");
const chalk = require("chalk");
const util = require('./util');
const copySubtask = require('./subtasks/copy');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');
const badgesSubtask = require('./subtasks/badges');
const structSubtask = require('./subtasks/struct');
const eslintSubtask = require('./subtasks/eslint');
const flowSubtask = require('./subtasks/flow');
const yamllintSubtask = require('./subtasks/yamllint');
const depcheckSubtask = require('./subtasks/depcheck');
const depusedSubtask = require('./subtasks/depused');
const nycSubtask = require('./subtasks/nyc');

const loadConfig = (cwd, name) => util
  .readTextFile(`${__dirname}/conf/${name}`).split("\n")
  // add additional config options from project
  .concat(fs.existsSync(`${cwd}/${name}`) ? util.readTextFile(`${cwd}/${name}`).split("\n") : [])
  .map(e => e.split("#", 1)[0].trim())
  .filter(e => e !== "");

module.exports = ({
  logger = log,
  cwd = process.cwd(),
  skip = [],
  rules = {}
} = {}) => {
  const savedCwd = process.cwd();

  const tasks = {
    _set_cwd: () => {
      process.chdir(cwd);
      return Promise.resolve();
    },
    copy: () => copySubtask(logger, cwd),
    package: () => packageSubtask(logger, cwd),
    configure: () => configureSubtask(logger, cwd),
    badges: () => badgesSubtask(logger, cwd),
    structure: () => structSubtask(logger, cwd, loadConfig(cwd, ".structignore")),
    eslint: () => eslintSubtask(logger, cwd, util.getEsLintFiles(cwd, loadConfig(cwd, ".eslintignore")), rules),
    flow: () => flowSubtask(logger, cwd),
    yamllint: () => yamllintSubtask(logger, cwd, util.getYamlFiles(cwd)),
    depcheck: () => depcheckSubtask(logger, cwd),
    depused: () => depusedSubtask(logger, cwd, loadConfig(cwd, ".depunusedignore")),
    nyc: () => nycSubtask(logger, cwd, util.getSrcFiles(cwd), util.getTestFiles(cwd), loadConfig(cwd, ".coverignore")),
    _restore_cwd: () => {
      process.chdir(savedCwd);
      return Promise.resolve();
    }
  };

  return [
    '_set_cwd',
    'copy',
    'package',
    'configure',
    'badges',
    'structure',
    'eslint',
    'flow',
    'yamllint',
    'depcheck',
    'depused',
    'nyc',
    '_restore_cwd'
  ]
    .filter(e => skip.indexOf(e) === -1)
    .reduce((prev, cur) => prev.then(() => {
      logger.info(`Running: ${chalk.green(cur)}`);
      return tasks[cur]();
    }), Promise.resolve())
    .catch((err) => {
      throw err instanceof Error ? err : new Error(err.toString());
    });
};
