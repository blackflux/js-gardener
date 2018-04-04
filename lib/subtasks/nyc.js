const path = require("path");
const Mocha = require('mocha');
const NYC = require('nyc');
const libCoverage = require('nyc/node_modules/istanbul-lib-coverage');

const safeDeleteCache = (f) => {
  if (require.cache[f]) {
    delete require.cache[f];
  }
};

module.exports = (logger, cwd, testFiles, srcFiles, exclude) => new Promise((resolve, reject) => {
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
    reporter: [
      "lcov",
      "text-summary"
    ],
    reportDir: path.join(cwd, 'coverage'),
    tempDirectory: path.join(cwd, 'coverage', '.nyc_output'),
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

  // eslint-disable-next-line no-underscore-dangle
  const coverageSaved = libCoverage.createCoverageMap(global.__coverage__);
  let success = true;
  const runner = mocha.run((failures) => {
    success = success && failures === 0;
  });
  runner.on('end', () => {
    nyc.writeCoverageFile();
    nyc.report();
    nyc.checkCoverage({
      lines: 100,
      statements: 100,
      functions: 100,
      branches: 100
    }, false);
    /* eslint-disable no-underscore-dangle */
    coverageSaved.merge(global.__coverage__);
    global.__coverage__ = coverageSaved.toJSON();
    /* eslint-enable no-underscore-dangle */
    return success ? resolve() : reject();
  });
});
