const { ESLint } = require('eslint');

module.exports = (logger, dir, { files = [], fix = false } = {}) => (async () => {
  if (files.length === 0) {
    throw new Error('No ESLint files found.');
  }

  const eslint = new ESLint({
    cwd: dir,
    fix,
    baseConfig: {},
    // we use glob on passed in files, due to https://github.com/eslint/eslint/issues/5623
    ignore: false,
    reportUnusedDisableDirectives: 'error'
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
