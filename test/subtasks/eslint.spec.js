const path = require('path');
const expect = require('chai').expect;
const sfs = require('smart-fs');
const desc = require('../util/desc');
const eslint = require('../../src/subtasks/eslint');

desc('Testing eslint', ({ it, beforeEach }) => {
  beforeEach(({ dir }) => {
    sfs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      sfs.smartRead(path.join(__dirname, '..', '..', '.eslintrc.json'))
    );
  });

  it('Testing Ok', async ({ dir, logger }) => {
    const idxFile = path.join(dir, 'src', 'index.js');
    sfs.smartWrite(idxFile, ['module.exports = {};']);
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), { root: true });
    expect(await eslint(logger, dir, { files: [idxFile] })).to.equal(undefined);
  });

  it('Testing No Files', async ({ dir, logger }) => {
    try {
      await eslint(logger, dir);
    } catch (e) {
      expect(String(e.message)).to.deep.contain('No ESLint files found.');
    }
  });

  it('Testing Exception: File Not Exists', async ({ logger }) => {
    try {
      await eslint(logger, null, { files: ['file'] });
    } catch (e) {
      expect(String(e)).to.contain('TypeError');
    }
  });

  it('Testing Exception: Invalid Fix Type', async ({ dir, logger }) => {
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), {
      root: true,
      rules: {
        'unknown/unknown': 1
      }
    });
    sfs.smartWrite(path.join(dir, 'index.js'), ["module.exports = 'string';\n"]);
    try {
      await eslint(logger, dir, { files: ['index.js'] });
    } catch (e) {
      expect(String(e)).to.contain('Error: Linter Problems');
    }
  });

  it('Testing Invalid File', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'index.js'), ['module.exports = "string"\n']);
    try {
      await eslint(logger, dir, { files: [path.join(dir, 'index.js')] });
    } catch (e) {
      expect(String(e)).to.contain('Error: Linter Problems');
      expect(String(logs)).to.contain('4 problems (3 errors, 1 warning)');
    }
  });
});
