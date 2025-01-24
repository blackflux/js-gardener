import path from 'path';
import fs from 'smart-fs';
import { expect } from 'chai';
import { describe } from 'node-tdd';
import eslint from '../../src/subtasks/eslint.js';

describe('Testing eslint', { record: console, useTmpDir: true }, () => {
  beforeEach(({ dir }) => {
    fs.smartWrite(path.join(dir, 'package.json'), { type: 'module' });
    fs.smartWrite(
      path.join(dir, 'eslint.config.js'),
      fs.smartRead(path.join(fs.dirname(import.meta.url), '..', '..', 'eslint.config.js'), { treatAs: 'txt' })
    );
    fs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      fs.smartRead(path.join(fs.dirname(import.meta.url), '..', '..', '.eslintrc.json'))
    );
    fs.symlinkSync(
      path.join(fs.dirname(import.meta.url), '..', '..', 'node_modules'),
      path.join(dir, 'node_modules')
    );
  });

  it('Testing Ok', async ({ dir }) => {
    const idxFile = path.join(dir, 'src', 'index.js');
    fs.smartWrite(idxFile, ['module.exports = {};']);
    fs.smartWrite(path.join(dir, '.eslintrc.json'), { root: true });
    fs.smartWrite(path.join(dir, 'eslint.config.js'), ['export default [];']);
    expect(await eslint(console, dir, { files: [idxFile] })).to.equal(undefined);
  });

  it('Testing reportUnusedDisableDirectives', async ({ dir, capture, recorder }) => {
    const idxFile = path.join(dir, 'src', 'index.js');
    fs.smartWrite(idxFile, ['// eslint-disable-next-line no-console\nmodule.exports = {};']);
    fs.smartWrite(path.join(dir, '.eslintrc.json'), { root: true });
    const e = await capture(() => eslint(console, dir, { files: [idxFile] }));
    expect(String(e)).to.equal('Error: Linter Problems');
    const logs = recorder.get();
    expect(logs.length).to.equal(1);
    expect(logs[0]).to.include('Unused eslint-disable directive');
  });

  it('Testing No Files', async ({ dir, capture }) => {
    const e = await capture(() => eslint(console, dir));
    expect(String(e.message)).to.deep.contain('No ESLint files found.');
  });

  it('Testing Exception: File Not Exists', async ({ capture }) => {
    const e = await capture(() => eslint(console, '/', { files: [String(Math.random())] }));
    expect(String(e)).to.contain('Error: No files matching');
  });

  it('Testing Exception: Invalid Fix Type', async ({ dir, capture }) => {
    fs.smartWrite(path.join(dir, '.eslintrc.json'), {
      root: true,
      rules: {
        'unknown/unknown': 1
      }
    });
    fs.smartWrite(path.join(dir, 'index.js'), ["export default 'string';\n"]);
    const e = await capture(() => eslint(console, dir, { files: ['index.js'] }));
    expect(String(e)).to.contain('Error: Linter Problems');
  });

  it('Testing Invalid File', async ({ dir, recorder, capture }) => {
    fs.smartWrite(path.join(dir, 'index.js'), ['export default "string"\n']);
    const e = await capture(() => eslint(console, dir, { files: [path.join(dir, 'index.js')] }));
    expect(String(e)).to.contain('Error: Linter Problems');
    expect(String(recorder.get())).to.contain('4 problems (3 errors, 1 warning)');
  });
});
