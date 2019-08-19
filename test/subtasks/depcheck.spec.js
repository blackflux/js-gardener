const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const desc = require('../util/desc');
const depcheck = require('../../src/subtasks/depcheck');
const exec = require('../../src/util/exec');

desc('Testing depcheck', ({ it }) => {
  it('Testing Not Installed (NPM)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' } });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    try {
      await depcheck(logger, dir);
    } catch (e) {
      expect(logs.length).to.equal(2);
      expect(logs[0][0]).to.equal('error');
      expect(logs[0][1]).to.contain('missing: mocha@5.0.5');
      expect(logs[1][0]).to.equal('error');
      expect(logs[1][1]).to.contain('npm ERR! missing: mocha@5.0.5');
    }
  }).timeout(30000);

  it('Testing Ok (NPM)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: {} });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    await depcheck(logger, dir);
    expect(logs.length).to.equal(0);
  }).timeout(30000);

  it('Testing Not Installed (YARN)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '4.0.0' }, license: 'MIT' });
    try {
      await depcheck(logger, dir);
    } catch (e) {
      expect(logs.length).to.equal(2);
      expect(logs[1][0]).to.equal('error');
      expect(logs[1][1]).to.contain('Your lockfile needs to be updated');
    }
  }).timeout(30000);

  it('Testing Ok (YARN)', async ({ dir, logs, logger }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    await depcheck(logger, dir);
    expect(logs.length).to.equal(0);
  }).timeout(30000);
});
