const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const desc = require('../util/desc');
const robo = require('../../src/subtasks/robo');


desc('Testing robo', ({ it }) => {
  it('Testing Success (Done)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    await robo(logger, dir);
    expect(logs.length, `Provided ${logs}`).to.equal(0);
  });

  it('Testing Update (Failure)', async ({ dir, logs, logger }) => {
    const result = [
      'Updated: CONFDOCS.md'
    ];
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {
      '@blackflux/robo-config-plugin': {
        tasks: [],
        variables: {}
      }
    });
    try {
      await robo(logger, dir);
    } catch (e) {
      expect(logs[0][0], `Provided ${logs}`).to.equal('error');
      expect([logs[0][1]], `Provided ${logs}`).to.deep.equal(result);
      expect(e).to.deep.equal(result);
    }
  });

  it('Testing Failure', async ({ dir, logs, logger }) => {
    const result = `Configuration File missing: ${dir}/.roboconfig`;
    try {
      await robo(logger, dir);
    } catch (e) {
      expect(logs.length).to.equal(1);
      expect(logs[0][0]).to.equal('error');
      expect(logs[0][1].message).to.equal(result);
      expect(e.message).to.equal(result);
    }
  });
});
