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
  process.chdir(cwd);

  const tasks = {
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
    nyc: () => nycSubtask(logger, cwd, util.getTestFiles(cwd), util.getSrcFiles(cwd), loadConfig(cwd, ".coverignore"))
  };

  return [
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
    'nyc'
  ]
    .filter(e => skip.indexOf(e) === -1)
    .reduce((prev, cur) => prev.then(() => {
      logger.info(`Running: ${chalk.green(cur)}`);
      return tasks[cur]();
    }), Promise.resolve())
    .then(() => process.chdir(savedCwd))
    .catch((err) => {
      throw err instanceof Error ? err : new Error(String(err));
    });
};
