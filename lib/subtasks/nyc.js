const path = require("path");
const Mocha = require('mocha');
const NYC = require('nyc');

// mocha_istanbul: {
//   this: {
//     src: util.getTestFiles(options.cwd),
//     options: {
//       check: {
//         lines: 100,
//           statements: 100,
//           branches: 100,
//           functions: 100
//       },
//       excludes: loadConfig(options.cwd, ".coverignore"),
//         mochaOptions: ['--sort'].concat(process.argv.slice(2)
//         .filter(e => e === '--debug' || e.startsWith('--filter='))),
//         istanbulOptions: ['--include-all-sources', '--default-excludes=false'],
//         root: '.'
//     },
//     reportFormats: ['lcov', 'cobertura', 'lcovonly']
//   }
// },

const safeDeleteCache = (f) => {
  if (require.cache[f]) {
    delete require.cache[f];
  }
};

module.exports = (logger, dir, srcFiles, testFiles, excluded) => new Promise((resolve, reject) => {
  const nyc = new NYC({
    "check-coverage": true,
    "per-file": true,
    lines: 100,
    statements: 100,
    functions: 100,
    branches: 100,
    exclude: excluded,
    reporter: [
      "html",
      "lcovonly"
    ],
    require: [
      "babel-register"
    ],
    cache: true,
    all: true,
    "report-dir": path.join(dir, 'coverage'),
    tempDirectory: path.join(dir, 'coverage', '.temporary'),
    cwd: dir
  });
  const mocha = new Mocha();

  mocha.suite.on('pre-require', (_, file) => {
    logger.info(`Pre-Require: ${file}`);
  });

  srcFiles.forEach(safeDeleteCache);
  nyc.reset();
  // nyc.wrap();
  testFiles.forEach((f) => {
    safeDeleteCache(path.join(dir, f));
    mocha.addFile(f);
  });
  srcFiles.forEach((f) => {
    logger.info(`Loading ${f}`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(path.join(dir, f));
  });
  nyc.addAllFiles();

  let success = true;
  const runner = mocha.run((failures) => {
    success = failures === 0;
  });
  runner.on('end', () => {
    nyc.writeCoverageFile();
    nyc.report();
    return success ? resolve() : reject(new Error("Test / Coverage Problems."));
  });
});
