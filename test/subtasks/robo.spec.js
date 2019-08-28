const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const { describe } = require('node-tdd');
const robo = require('../../src/subtasks/robo');


describe('Testing robo', { useTmpDir: true, record: console }, () => {
  it('Testing Success (Done)', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    await robo(console, dir);
    expect(recorder.get()).to.deep.equal([]);
  });

  it('Testing Update (Failure)', async ({ dir, capture, recorder }) => {
    const result = ['Updated: CONFDOCS.md'];
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {
      '@blackflux/robo-config-plugin': {
        tasks: [],
        variables: {}
      }
    });
    const e = await capture(() => robo(console, dir));
    expect(e).to.deep.equal(result);
    expect(recorder.get()).to.deep.equal(result);
  });

  it('Testing Failure', async ({ dir, capture, recorder }) => {
    const result = `Configuration File missing: ${dir}/.roboconfig`;
    const e = await capture(() => robo(console, dir));
    expect(e.message).to.equal(result);
    const logs = recorder.get();
    expect(logs.length).to.equal(1);
    expect(logs[0]).to.equal(result);
  });
});
