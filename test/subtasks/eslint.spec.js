const path = require('path');
const expect = require('chai').expect;
const eslint = require('../../src/subtasks/eslint');

const logs = [];
const logger = { info: e => logs.push(e) };
const projectFolder = path.join(__dirname, '..', '..');

describe('Testing eslint', () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing No Files', (done) => {
    eslint(logger, projectFolder).catch((result) => {
      expect(String(result)).to.deep.contain('No ESLint files found.');
      done();
    });
  });

  it('Testing Exception', (done) => {
    eslint(logger, null, { files: ['file'] }).catch((result) => {
      expect(String(result)).to.contain('TypeError');
      done();
    });
  });

  it('Testing Invalid File', (done) => {
    eslint(logger, projectFolder, { files: [path.join(projectFolder, 'LICENSE')] }).catch((result) => {
      expect(String(result)).to.contain('Error: Linter Problems');
      expect(String(logs)).to.contain('1 problem (1 error, 0 warnings)');
      done();
    });
  });
});
