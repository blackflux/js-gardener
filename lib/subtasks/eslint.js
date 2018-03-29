const path = require("path");
const eslint = require("eslint");

module.exports = (grunt, dir, files, rules) => {
  if (files.length === 0) {
    grunt.log.error(["No ESLint files found."]);
    return false;
  }

  const engine = new eslint.CLIEngine({
    cwd: dir,
    baseConfig: { rules },
    configFile: path.resolve(`${__dirname}/../conf/eslint.json`),
    rulePaths: [path.resolve(`${__dirname}/../conf/rules`)],
    // we use glob on passed in files, due to https://github.com/eslint/eslint/issues/5623
    ignore: false
  });

  let report;
  try {
    report = engine.executeOnFiles(files);
  } catch (err) {
    grunt.log.error([err]);
    return false;
  }

  const output = engine.getFormatter()(report.results);
  if (output) {
    // eslint-disable-next-line no-console
    console.log(output);
  }

  return report.warningCount === 0 && report.errorCount === 0;
};
