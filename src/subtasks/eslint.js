const path = require('path');
const eslint = require('eslint');

module.exports = (logger, dir, { files = [], fix = false } = {}) => new Promise((resolve, reject) => {
  if (files.length === 0) {
    return reject(new Error('No ESLint files found.'));
  }

  const engine = new eslint.CLIEngine({
    cwd: dir,
    fix,
    baseConfig: {},
    configFile: path.resolve(path.join(dir, '.eslintrc.json')),
    // we use glob on passed in files, due to https://github.com/eslint/eslint/issues/5623
    ignore: false
  });

  let report;
  try {
    report = engine.executeOnFiles(files);
    eslint.CLIEngine.outputFixes(report);
  } catch (err) {
    return reject(err);
  }

  const output = engine.getFormatter()(report.results);
  if (output) {
    logger.info(output);
  }

  return report.warningCount === 0 && report.errorCount === 0 ? resolve() : reject(new Error('Linter Problems'));
});
