const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const { describe } = require('node-tdd');
const util = require('../../src/util');
const struct = require('../../src/subtasks/struct');

describe('Testing struct', { useTmpDir: true, record: console }, () => {
  it('Testing Ok', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'src', 'index.js'), ['']);
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    expect(await struct(console, dir, [])).to.equal(undefined);
    expect(recorder.get()).to.deep.equal([]);
  });

  it('Testing Ok (Ignored)', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    sfs.smartWrite(path.join(dir, '.structignore'), ['test/index.spec.js']);
    expect(await struct(console, dir, util.loadConfig(dir, '.structignore'))).to.equal(undefined);
    expect(recorder.get()).to.deep.equal([]);
  });

  it('Testing Failure', async ({ dir, capture, recorder }) => {
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    await capture(struct(console, dir, []));
    const logs = recorder.get();
    expect(logs.length).to.equal(1);
    expect(logs[0]).to.contain('index.js to exist for ');
    expect(logs[0]).to.contain('index.spec.js');
  });
});
