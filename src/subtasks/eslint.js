import path from 'path';
import fs from 'smart-fs';
import { ESLint } from 'eslint';
import { transform } from 'plugin-name-to-package-name';

export default (logger, dir, { files = [], fix = false } = {}) => (async () => {
  if (files.length === 0) {
    throw new Error('No ESLint files found.');
  }

  const configFile = path.join(dir, '.eslintrc.json');
  const config = fs.existsSync(configFile) ? fs.smartRead(configFile) : {};
  const plugins = Object.fromEntries(await Promise.all((config.plugins || [])
    .map((p) => transform(p, 'eslint-plugin'))
    .map((p) => import(p).then(({ default: d }) => [p, d]))));

  const eslint = new ESLint({
    cwd: dir,
    fix,
    plugins,
    baseConfig: {},
    flags: ['unstable_config_lookup_from_file'], // allow nested eslint config
    // we use glob on passed in files, due to https://github.com/eslint/eslint/issues/5623
    ignore: false,
    overrideConfig: {
      linterOptions: {
        reportUnusedDisableDirectives: 'error'
      }
    }
  });
  const results = await eslint.lintFiles(files);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter('stylish');
  const resultText = formatter.format(results);

  if (resultText) {
    logger.info(resultText);
  }

  if (results.some((e) => e.warningCount !== 0 || e.errorCount !== 0)) {
    throw new Error('Linter Problems');
  }
})();
