const tmp = require('tmp');

const logLevel = ['debug', 'info', 'warning', 'error', 'critical'];

module.exports = (suiteName, tests) => {
  let dir = null;
  const logs = [];
  const logger = logLevel.reduce((p, c) => Object.assign(p, {
    [c]: (e) => logs.push([c, e])
  }), {});
  const getArgs = () => ({ dir, logger, logs });
  let beforeEachCb = () => {};

  describe(suiteName, () => {
    before(() => {
      tmp.setGracefulCleanup();
    });

    beforeEach(async () => {
      dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
      logs.length = 0;
      await beforeEachCb(getArgs());
    });

    tests({
      it: (testName, fn) => it(testName, () => fn(getArgs())),
      beforeEach: (fn) => {
        beforeEachCb = fn;
      }
    });
  });
};
