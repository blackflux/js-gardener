import assert from 'assert';
import fs from 'smart-fs';
import log from 'fancy-log';
import chalk from 'chalk';
import Joi from 'joi-strict';
import { getEsLintFiles, getYamlFiles, loadConfig } from './util.js';
import roboSubtask from './subtasks/robo.js';
import structSubtask from './subtasks/struct.js';
import eslintSubtask from './subtasks/eslint.js';
import yamllintSubtask from './subtasks/yamllint.js';
import depcheckSubtask from './subtasks/depcheck.js';
import depusedSubtask from './subtasks/depused.js';

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

export default (options = {}) => {
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
    structure: () => structSubtask(ctx.logger, ctx.cwd, loadConfig(ctx.cwd, '.structignore')),
    eslint: () => eslintSubtask(ctx.logger, ctx.cwd, {
      files: getEsLintFiles(ctx.cwd, loadConfig(ctx.cwd, '.eslintignore')),
      fix: process.argv.includes('--fix')
    }),
    yamllint: () => yamllintSubtask(ctx.logger, ctx.cwd, getYamlFiles(ctx.cwd)),
    depcheck: () => depcheckSubtask(ctx.logger, ctx.cwd),
    depused: () => depusedSubtask(ctx.logger, ctx.cwd, loadConfig(ctx.cwd, '.depunusedignore'))
  };

  return taskNames
    .filter((e) => ctx.skip.indexOf(e) === -1)
    .reduce((prev, cur) => prev.then(() => {
      ctx.logger.info(`Running: ${chalk.green(cur)}`);
      return tasks[cur]();
    }), Promise.resolve());
};
