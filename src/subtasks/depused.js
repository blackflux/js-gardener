import npmCheck from 'npm-check';
import difference from 'lodash.difference';

// Return Promise resolving to true iff packages are in good state
export default (logger, dir, suppressed) => (async () => npmCheck({ cwd: dir })
  .then((currentState) => currentState.get('packages').filter((e) => e.unused).map((e) => e.moduleName))
  .then((unused) => {
    const unexpected = difference(unused, suppressed).sort();
    if (unexpected.length !== 0) {
      logger.error(`Unused/Not Installed Dependencies: ${unexpected.join(', ')}`);
    }
    const suppressedNotUnused = difference(suppressed, unused).sort();
    if (suppressedNotUnused.length !== 0) {
      logger.error(`Suppressed, not installed Dependencies: ${suppressedNotUnused.join(', ')}`);
    }
    if (unexpected.length !== 0 || suppressedNotUnused.length !== 0) {
      throw new Error('depused failed');
    }
  }))();
