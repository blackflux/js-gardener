const fs = require('fs');
const log = require('fancy-log');
const chalk = require('chalk');
const util = require('./util');
const roboSubtask = require('./subtasks/robo');
const copySubtask = require('./subtasks/copy');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');
const structSubtask = require('./subtasks/struct');
const auditSubtask = require('./subtasks/audit');
const eslintSubtask = require('./subtasks/eslint');
const flowSubtask = require('./subtasks/flow');
const yamllintSubtask = require('./subtasks/yamllint');
const depcheckSubtask = require('./subtasks/depcheck');
const depusedSubtask = require('./subtasks/depused');

module.exports = ({
  logger = log,
  cwd = process.cwd(),
  skip = [],
  npm = true,
  copy = { skip: [] },
  configure = { skip: [] },
  eslint = {},
  docker = false
} = {}) => {
  // todo: validate input params

  const savedCwd = process.cwd();
  process.chdir(cwd);

  if (npm === true) {
    configure.skip.push('.releaserc.json#npm');
  }
  if (docker !== false && !fs.existsSync('/.dockerenv')) {
    throw Error('Please run in Docker');
  }

  const tasks = {
    robo: () => roboSubtask(logger, cwd),
    copy: () => copySubtask(logger, cwd, copy),
    package: () => packageSubtask(logger, cwd),
    configure: () => configureSubtask(logger, cwd, configure),
    structure: () => structSubtask(logger, cwd, util.loadConfig(cwd, '.structignore')),
    audit: () => auditSubtask(logger, cwd),
    eslint: () => eslintSubtask(logger, cwd, {
      files: util.getEsLintFiles(cwd, util.loadConfig(cwd, '.eslintignore')),
      rules: { 'flow-enforce': 0, 'kebab-case-enforce': 1, ...eslint },
      fix: process.argv.includes('--fix')
    }),
    flow: () => flowSubtask(logger, cwd),
    yamllint: () => yamllintSubtask(logger, cwd, util.getYamlFiles(cwd)),
    depcheck: () => depcheckSubtask(logger, cwd),
    depused: () => depusedSubtask(logger, cwd, util.loadConfig(cwd, '.depunusedignore'))
  };

  return [
    'robo',
    'copy',
    'package',
    'configure',
    'structure',
    'audit',
    'eslint',
    'flow',
    'yamllint',
    'depcheck',
    'depused'
  ]
    .filter(e => skip.indexOf(e) === -1)
    .reduce((prev, cur) => prev.then(() => {
      logger.info(`Running: ${chalk.green(cur)}`);
      return tasks[cur]();
    }), Promise.resolve())
    .then(() => process.chdir(savedCwd))
    .catch((err) => {
      process.chdir(savedCwd);
      throw err;
    });
};
