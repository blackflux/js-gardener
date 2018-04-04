const path = require("path");
const Mocha = require('mocha');
const NYC = require('nyc');

const safeDeleteCache = (f) => {
  if (require.cache[f]) {
    delete require.cache[f];
  }
};

module.exports = (logger, cwd, srcFiles, testFiles, exclude) => new Promise((resolve) => {
  const mocha = new Mocha({ bail: true });
  mocha.suite.on('pre-require', (_, file) => {
    logger.info(`Pre-Require: ${file}`);
  });

  const srcFilesAbs = srcFiles.map(f => path.join(cwd, f));
  const testFilesAbs = testFiles.map(f => path.join(cwd, f));

  const nyc = new NYC({
    require: [],
    include: [],
    exclude,
    sourceMap: false,
    babel: true,
    tempDirectory: path.join(cwd, 'coverage', '.nyc_output'),
    reporter: [
      "lcov",
      "text-summary"
    ],
    reportDir: path.join(cwd, 'coverage'),
    cwd
  });

  srcFilesAbs.forEach(safeDeleteCache);
  nyc.reset();
  nyc.wrap();
  testFilesAbs.forEach((f) => {
    safeDeleteCache(f);
    mocha.addFile(f);
  });
  srcFilesAbs.forEach((f) => {
    logger.info(`Loading ${f}`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(`${f}`);
  });

  const runner = mocha.run((failures) => {
    process.on('exit', () => {
      process.exit(failures);
    });
  });
  runner.on('end', () => {
    nyc.writeCoverageFile();
    nyc.report();
    resolve();
  });
});
