const path = require('path');
const childProcess = require('child_process');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const { describe } = require('node-tdd');
const depcheck = require('../../src/subtasks/depcheck');
const exec = require('../../src/util/exec');

describe('Testing depcheck', { timeout: 30000, record: console, useTmpDir: true }, () => {
  it('Testing Not Installed (NPM)', async ({ dir, recorder, capture }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' } });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    await capture(() => depcheck(console, dir));
    const logs = recorder.get('error');
    expect(logs.length).to.equal(2);
    expect(logs[0]).to.include('missing: mocha@5.0.5');
    expect(logs[1]).to.include('npm ERR! missing: mocha@5.0.5');
  });

  it('Testing Ok (NPM)', async ({ dir, recorder }) => {
    // todo: remove monkey patch once circleci container is updated
    const spawnSyncOriginal = childProcess.spawnSync;
    childProcess.spawnSync = () => ({ stdout: '', stderr: '' });
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: {} });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    await depcheck(console, dir);
    expect(recorder.get()).to.deep.equal([]);
    childProcess.spawnSync = spawnSyncOriginal;
  });

  it('Testing Not Installed (YARN)', async ({ dir, recorder, capture }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '4.0.0' }, license: 'MIT' });
    await capture(() => depcheck(console, dir));
    const logs = recorder.get();
    expect(logs.length).to.equal(2);
    expect(logs[1]).to.include('Your lockfile needs to be updated');
  });

  it('Testing Ok (YARN)', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    exec.run('yarn install --silent --non-interactive', dir);
    await depcheck(console, dir);
    expect(recorder.get()).to.deep.equal([]);
  });
});
