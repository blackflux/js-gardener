const assert = require('assert');
const fs = require('fs');
const log = require('fancy-log');
const chalk = require('chalk');
const Joi = require('joi-strict');
const util = require('./util');
const roboSubtask = require('./subtasks/robo');
const structSubtask = require('./subtasks/struct');
const eslintSubtask = require('./subtasks/eslint');
const yamllintSubtask = require('./subtasks/yamllint');
const depcheckSubtask = require('./subtasks/depcheck');
const depusedSubtask = require('./subtasks/depused');

const taskNames = [
  'robo',
  'structure',
  'eslint',
  'yamllint',
  'depcheck',
  'depused'
];
const schema = Joi.object().keys({
  logger: Joi.any(),
  cwd: Joi.string(),
  skip: Joi.array().items(Joi.string().valid(...taskNames)).unique(),
  docker: Joi.boolean()
});

module.exports = (options = {}) => {
  assert(options instanceof Object && !Array.isArray(options));
  const ctx = {
    logger: log,
    cwd: process.cwd(),
    skip: [],
    docker: false,
    ...options
  };
  assert(
    schema.validate(ctx).error === undefined,
    `Parameter Validation Error: ${schema.validate(ctx).error}`
  );

  if (ctx.docker !== false && !fs.existsSync('/.dockerenv')) {
    throw Error('Please run in Docker');
  }

  const tasks = {
    robo: () => roboSubtask(ctx.logger, ctx.cwd),
    structure: () => structSubtask(ctx.logger, ctx.cwd, util.loadConfig(ctx.cwd, '.structignore')),
    eslint: () => eslintSubtask(ctx.logger, ctx.cwd, {
      files: util.getEsLintFiles(ctx.cwd, util.loadConfig(ctx.cwd, '.eslintignore')),
      fix: process.argv.includes('--fix')
    }),
    yamllint: () => yamllintSubtask(ctx.logger, ctx.cwd, util.getYamlFiles(ctx.cwd)),
    depcheck: () => depcheckSubtask(ctx.logger, ctx.cwd),
    depused: () => depusedSubtask(ctx.logger, ctx.cwd, util.loadConfig(ctx.cwd, '.depunusedignore'))
  };

  return taskNames
    .filter((e) => ctx.skip.indexOf(e) === -1)
    .reduce((prev, cur) => prev.then(() => {
      ctx.logger.info(`Running: ${chalk.green(cur)}`);
      return tasks[cur]();
    }), Promise.resolve());
};
