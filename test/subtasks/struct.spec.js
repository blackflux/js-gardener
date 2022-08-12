import path from 'path';
import { expect } from 'chai';
import sfs from 'smart-fs';
import { describe } from 'node-tdd';
import { loadConfig } from '../../src/util.js';
import struct from '../../src/subtasks/struct.js';

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
    expect(await struct(console, dir, loadConfig(dir, '.structignore'))).to.equal(undefined);
    expect(recorder.get()).to.deep.equal([]);
  });

  it('Testing Failure', async ({ dir, capture, recorder }) => {
    sfs.smartWrite(path.join(dir, 'test', 'index.spec.js'), ['']);
    await capture(() => struct(console, dir, []));
    const logs = recorder.get();
    expect(logs.length).to.equal(1);
    expect(logs[0]).to.contain('index.js to exist for ');
    expect(logs[0]).to.contain('index.spec.js');
  });
});
