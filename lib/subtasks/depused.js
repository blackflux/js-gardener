const npmCheck = require('npm-check');
const difference = require('lodash.difference');


// Return Promise resolving to true iff packages are in good state. Prints errors to grunt log.
module.exports = (grunt, dir, suppressed) => npmCheck({ cwd: dir })
  .then(currentState => currentState.get('packages').filter(e => e.unused).map(e => e.moduleName))
  .then((unused) => {
    const unexpected = difference(unused, suppressed).sort();
    if (unexpected.length !== 0) {
      grunt.log.error([`Unused Dependencies: ${unexpected.join(", ")}`]);
    }
    const suppressedNotUnused = difference(suppressed, unused).sort();
    if (suppressedNotUnused.length !== 0) {
      grunt.log.error([`Suppressed, detected Dependencies: ${suppressedNotUnused.join(", ")}`]);
    }
    return Promise.resolve(unexpected.length === 0 && suppressedNotUnused.length === 0);
  });
