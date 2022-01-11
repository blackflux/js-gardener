const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const sfs = require('smart-fs');
const eslint = require('../../src/subtasks/eslint');

describe('Testing eslint', { record: console, useTmpDir: true }, () => {
  beforeEach(({ dir }) => {
    sfs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      sfs.smartRead(path.join(__dirname, '..', '..', '.eslintrc.json'))
    );
    fs.symlinkSync(
      path.join(__dirname, '..', '..', 'node_modules'),
      path.join(dir, 'node_modules')
    );
  });

  it('Testing Ok', async ({ dir }) => {
    const idxFile = path.join(dir, 'src', 'index.js');
    sfs.smartWrite(idxFile, ['module.exports = {};']);
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), { root: true });
    expect(await eslint(console, dir, { files: [idxFile] })).to.equal(undefined);
  });

  it('Testing reportUnusedDisableDirectives', async ({ dir, capture, recorder }) => {
    const idxFile = path.join(dir, 'src', 'index.js');
    sfs.smartWrite(idxFile, ['// eslint-disable-next-line no-console\nmodule.exports = {};']);
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), { root: true });
    const e = await capture(() => eslint(console, dir, { files: [idxFile] }));
    expect(String(e)).to.equal('Error: Linter Problems');
    const logs = recorder.get();
    expect(logs.length).to.equal(1);
    expect(logs[0]).to.include('Unused eslint-disable directive');
  });

  it('Testing No Files', async ({ dir }) => {
    try {
      await eslint(console, dir);
    } catch (e) {
      expect(String(e.message)).to.deep.contain('No ESLint files found.');
    }
  });

  it('Testing Exception: File Not Exists', async () => {
    try {
      await eslint(console, '/', { files: [String(Math.random())] });
    } catch (e) {
      expect(String(e)).to.contain('Error: No files matching');
    }
  });

  it('Testing Exception: Invalid Fix Type', async ({ dir }) => {
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), {
      root: true,
      rules: {
        'unknown/unknown': 1
      }
    });
    sfs.smartWrite(path.join(dir, 'index.js'), ["module.exports = 'string';\n"]);
    try {
      await eslint(console, dir, { files: ['index.js'] });
    } catch (e) {
      expect(String(e)).to.contain('Error: Linter Problems');
    }
  });

  it('Testing Invalid File', async ({ dir, recorder }) => {
    sfs.smartWrite(path.join(dir, 'index.js'), ['module.exports = "string"\n']);
    try {
      await eslint(console, dir, { files: [path.join(dir, 'index.js')] });
    } catch (e) {
      expect(String(e)).to.contain('Error: Linter Problems');
      expect(String(recorder.get())).to.contain('4 problems (3 errors, 1 warning)');
    }
  });
});
