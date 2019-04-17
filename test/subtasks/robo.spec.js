const path = require('path');
const tmp = require('tmp');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const robo = require('../../src/subtasks/robo');

const logs = [];
const logger = { error: e => logs.push(e) };

describe('Testing robo', () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    logs.length = 0;
  });

  it('Testing Success (Done)', (done) => {
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    robo(logger, dir).then(() => {
      expect(logs.length, `Provided ${logs}`).to.equal(0);
      expect(logs, `Provided ${logs}`).to.deep.equal([]);
      done();
    }).catch(done.fail);
  });

  it('Testing Update (Failure)', (done) => {
    const result = [
      'Updated: CONFDOCS.md'
    ];
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {
      '@blackflux/robo-config-plugin': {
        tasks: [],
        variables: {}
      }
    });
    robo(logger, dir).catch((r) => {
      expect(logs, `Provided ${logs}`).to.deep.equal(result);
      expect(r).to.deep.equal(result);
      done();
    });
  });

  it('Testing Failure', (done) => {
    const result = `Configuration File missing: ${dir}/.roboconfig`;
    robo(logger, dir).catch((r) => {
      expect(logs.length).to.equal(1);
      expect(logs[0].message).to.equal(result);
      expect(r.message).to.equal(result);
      done();
    });
  });
});
