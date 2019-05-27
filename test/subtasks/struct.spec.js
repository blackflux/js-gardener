const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const util = require('../../src/util');
const desc = require('../util/desc');
const struct = require('../../src/subtasks/struct');


desc('Testing struct', ({ it }) => {
  it('Testing Ok', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'src', 'index.js'), ['']);
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    expect(await struct(logger, dir, [])).to.equal(undefined);
    expect(logs.length).to.equal(0);
  });

  it('Testing Ok (Ignored)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    sfs.smartWrite(path.join(dir, '.structignore'), ['test/index.spec.js']);
    expect(await struct(logger, dir, util.loadConfig(dir, '.structignore'))).to.equal(undefined);
    expect(logs.length).to.equal(0);
  });

  it('Testing Failure', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    try {
      await struct(logger, dir, []);
    } catch (e) {
      expect(logs.length, `Provided ${logs}`).to.equal(1);
      expect(logs[0][0]).to.equal('error');
      expect(logs[0][1], `Provided ${logs}`).to.contain('index.js to exist for ');
      expect(logs[0][1], `Provided ${logs}`).to.contain('index.spec.js');
    }
  });
});
