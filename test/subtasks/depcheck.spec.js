const path = require('path');
const tmp = require('tmp');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const depcheck = require('../../src/subtasks/depcheck');
const exec = require('./../../src/util/exec');

const logs = [];
const logger = { error: e => logs.push(e) };

tmp.setGracefulCleanup();

describe('Testing depcheck', () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    logs.length = 0;
  });

  it('Testing Not Installed (NPM)', (done) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' } });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    depcheck(logger, dir).catch(() => {
      expect(logs.length).to.equal(2);
      expect(logs[0]).to.contain('missing: mocha@5.0.5');
      expect(logs[1]).to.contain('npm ERR! missing: mocha@5.0.5');
      done();
    }).catch(done.fail);
  }).timeout(30000);

  it('Testing Ok (NPM)', (done) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: {} });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    depcheck(logger, dir).then(() => {
      expect(logs.length).to.equal(0);
      done();
    }).catch(done.fail);
  }).timeout(30000);

  it('Testing Not Installed (YARN)', (done) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '4.0.0' }, license: 'MIT' });
    depcheck(logger, dir).catch(() => {
      expect(logs.length).to.equal(2);
      expect(logs[1]).to.contain('Your lockfile needs to be updated');
      done();
    }).catch(done.fail);
  }).timeout(30000);

  it('Testing Ok (YARN)', (done) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    depcheck(logger, dir).then(() => {
      expect(logs.length).to.equal(0);
      done();
    }).catch(done.fail);
  }).timeout(30000);
});
