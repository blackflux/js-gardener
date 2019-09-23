const eslint = require('eslint');

module.exports = (logger, dir, { files = [], fix = false } = {}) => new Promise((resolve, reject) => {
  if (files.length === 0) {
    return reject(new Error('No ESLint files found.'));
  }

  const engine = new eslint.CLIEngine({
    cwd: dir,
    fix,
    baseConfig: {},
    // we use glob on passed in files, due to https://github.com/eslint/eslint/issues/5623
    ignore: false,
    reportUnusedDisableDirectives: true
  });
  const report = engine.executeOnFiles(files);
  eslint.CLIEngine.outputFixes(report);

  const output = engine.getFormatter()(report.results);
  if (output) {
    logger.info(output);
  }

  return report.warningCount === 0 && report.errorCount === 0 ? resolve() : reject(new Error('Linter Problems'));
});
