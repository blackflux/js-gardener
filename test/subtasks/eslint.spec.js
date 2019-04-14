const path = require('path');
const expect = require('chai').expect;
const tmp = require('tmp');
const sfs = require('smart-fs');
const eslint = require('../../src/subtasks/eslint');

const logs = [];
const logger = { info: e => logs.push(e) };

describe('Testing eslint', () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    sfs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      sfs.smartRead(path.join(__dirname, '..', '..', '.eslintrc.json'))
    );
    logs.length = 0;
  });

  it('Testing No Files', (done) => {
    eslint(logger, dir)
      .then(done.fail)
      .catch((result) => {
        expect(String(result)).to.deep.contain('No ESLint files found.');
        done();
      });
  });

  it('Testing Exception: File Not Exists', (done) => {
    eslint(logger, null, { files: ['file'] })
      .then(done.fail)
      .catch((result) => {
        expect(String(result)).to.contain('TypeError');
        done();
      });
  });

  it('Testing Exception: Invalid Fix Type', (done) => {
    sfs.smartWrite(path.join(dir, '.eslintrc.json'), {
      root: true,
      rules: {
        'unknown/unknown': 1
      }
    });
    sfs.smartWrite(path.join(dir, 'index.js'), ["module.exports = 'string';\n"]);
    eslint(logger, dir, { files: ['index.js'] })
      .then(done.fail)
      .catch((result) => {
        expect(String(result)).to.contain('Error: Linter Problems');
        done();
      });
  });

  it('Testing Invalid File', (done) => {
    sfs.smartWrite(path.join(dir, 'index.js'), ['module.exports = "string"\n']);
    eslint(logger, dir, { files: [path.join(dir, 'index.js')] })
      .then(done.fail)
      .catch((result) => {
        expect(String(result)).to.contain('Error: Linter Problems');
        expect(String(logs)).to.contain('4 problems (3 errors, 1 warning)');
        done();
      });
  });
});
