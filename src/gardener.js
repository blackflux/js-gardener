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

module.exports = ({
  logger = log,
  cwd = process.cwd(),
  skip = [],
  license = "MIT",
  author = "The Author",
  ci = ["travis"],
  npm = true,
  copy = { skip: [] },
  configure = { skip: [] },
  badges = { skip: [] },
  eslint = { rules: { "flow-enforce": 0 } }
} = {}) => {
  const savedCwd = process.cwd();
  process.chdir(cwd);

  if (["MIT", "UNLICENSED"].indexOf(license) === -1) {
    throw new Error("Invalid license provided!");
  }

  if (ci.indexOf("circle") === -1) {
    copy.skip.push(".circleci", ".circleci/config.yml");
    configure.skip.push(".circleci/config.yml");
    badges.skip.push("circleci");
  }
  if (ci.indexOf("travis") === -1) {
    copy.skip.push(".travis.yml");
    configure.skip.push(".travis.yml");
    badges.skip.push("travisci");
  }
  if (npm === true) {
    copy.skip.push(".releaserc.json");
    configure.skip.push(".releaserc.json");
  }

  const tasks = {
    copy: () => copySubtask(logger, cwd, copy),
    package: () => packageSubtask(logger, cwd, { license, author }),
    configure: () => configureSubtask(logger, cwd, configure),
    badges: () => badgesSubtask(logger, cwd, badges),
    structure: () => structSubtask(logger, cwd, util.loadConfig(cwd, ".structignore")),
    eslint: () => eslintSubtask(logger, cwd, util.getEsLintFiles(cwd, util.loadConfig(cwd, ".eslintignore")), eslint),
    flow: () => flowSubtask(logger, cwd),
    yamllint: () => yamllintSubtask(logger, cwd, util.getYamlFiles(cwd)),
    depcheck: () => depcheckSubtask(logger, cwd),
    depused: () => depusedSubtask(logger, cwd, util.loadConfig(cwd, ".depunusedignore"))
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
