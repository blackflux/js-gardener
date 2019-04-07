const fs = require('fs');
const log = require('fancy-log');
const chalk = require('chalk');
const util = require('./util');
const roboSubtask = require('./subtasks/robo');
const copySubtask = require('./subtasks/copy');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');
const badgesSubtask = require('./subtasks/badges');
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
  ci = ['travis'],
  npm = true,
  copy = { skip: [] },
  configure = { skip: [] },
  badges = { skip: [] },
  eslint = {},
  docker = [],
  dependabot = false
} = {}) => {
  // todo: validate input params

  const savedCwd = process.cwd();
  process.chdir(cwd);

  if (ci.indexOf('circle') === -1) {
    copy.skip.push('.circleci', '.circleci/config.yml');
    configure.skip.push('.circleci/config.yml');
    badges.skip.push('circleci');
  }
  if (ci.indexOf('travis') === -1) {
    copy.skip.push('.travis.yml');
    configure.skip.push('.travis.yml');
    badges.skip.push('travisci');
  }
  if (npm === true) {
    configure.skip.push('.releaserc.json#npm');
  }
  if (docker.indexOf('lambda') === -1) {
    copy.skip.push('manage.sh', 'docker', 'docker/Dockerfile');
  } else if (!fs.existsSync('/.dockerenv')) {
    // Ensure running in docker container
    throw Error('Please run in Docker using ". manage.sh"');
  }
  if (dependabot !== true) {
    copy.skip.push('.dependabot', '.dependabot/config.yml');
    configure.skip.push('.releaserc.json#dependabot');
  }

  const tasks = {
    robo: () => roboSubtask(logger, cwd),
    copy: () => copySubtask(logger, cwd, copy),
    package: () => packageSubtask(logger, cwd),
    configure: () => configureSubtask(logger, cwd, configure),
    badges: () => badgesSubtask(logger, cwd, badges),
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
    'badges',
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
