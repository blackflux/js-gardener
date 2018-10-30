const npmCheck = require('npm-check');
const difference = require('lodash.difference');

// Return Promise resolving to true iff packages are in good state
module.exports = (logger, dir, suppressed) =>
  new Promise((resolve, reject) =>
    npmCheck({ cwd: dir })
      .then(currentState =>
        currentState
          .get('packages')
          .filter(e => e.unused)
          .map(e => e.moduleName)
      )
      .then(unused => {
        const unexpected = difference(unused, suppressed).sort();
        if (unexpected.length !== 0) {
          logger.error(`Unused/Not Installed Dependencies: ${unexpected.join(', ')}`);
        }
        const suppressedNotUnused = difference(suppressed, unused).sort();
        if (suppressedNotUnused.length !== 0) {
          logger.error(`Suppressed, detected Dependencies: ${suppressedNotUnused.join(', ')}`);
        }
        return unexpected.length === 0 && suppressedNotUnused.length === 0 ? resolve() : reject();
      })
  );
