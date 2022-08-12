import path from 'path';
import sfs from 'smart-fs';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import depused from '../../src/subtasks/depused.js';

describe('Testing depused', { useTmpDir: true, record: console, timeout: 60000 }, () => {
  it('Testing Ok', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {});
    await depused(console, dir, []);
    expect(recorder.get().length).to.equal(0);
  });

  it('Testing Unnecessary Suppressed', async ({ dir, capture, recorder }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {});
    const deps = ['@babel/register'];
    await capture(() => depused(console, dir, deps));
    const logs = recorder.get();
    expect(logs)
      .to.deep.equal([`Suppressed, not installed Dependencies: ${deps.join(',')}`]);
  });

  it('Testing Unused', async ({ dir, capture, recorder }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {
      name: 'pkg',
      dependencies: {
        'object-scan': '1.0.0'
      },
      main: 'index.js'
    });
    await capture(() => depused(console, dir, []));
    const logs = recorder.get();
    expect(logs)
      .to.deep.equal(['Unused/Not Installed Dependencies: object-scan']);
  });
});
