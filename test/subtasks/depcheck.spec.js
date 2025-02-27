import path from 'path';
import childProcess from 'child_process';
import { expect } from 'chai';
import sfs from 'smart-fs';
import { describe } from 'node-tdd';
import depcheck from '../../src/subtasks/depcheck.js';
import { run } from '../../src/util/exec.js';

describe('Testing depcheck', { timeout: 30000, record: console, useTmpDir: true }, () => {
  it('Testing Not Installed (NPM)', async ({ dir, recorder, capture }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' } });
    sfs.smartWrite(path.join(dir, 'package-lock.json'), { lockfileVersion: 1 });
    await capture(() => depcheck(console, dir));
    const logs = recorder.get('error');
    expect(logs.length).to.equal(2);
    expect(String(logs[0])).to.include('missing: mocha@5.0.5');
    expect(String(logs[1])).to.include('missing: mocha@5.0.5');
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
    run('yarn install --silent --non-interactive', dir);
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '4.0.0' }, license: 'MIT' });
    await capture(() => depcheck(console, dir));
    const logs = recorder.get();
    expect(logs.length).to.equal(2);
    expect(logs[1]).to.include('Your lockfile needs to be updated');
  });

  it('Testing Ok (YARN)', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), { dependencies: { mocha: '5.0.5' }, license: 'MIT' });
    run('yarn install --silent --non-interactive', dir);
    await depcheck(console, dir);
    expect(recorder.get()).to.deep.equal([]);
  });
});
