const path = require('path');
const sfs = require('smart-fs');
const expect = require('chai').expect;
const desc = require('../util/desc');
const yamllint = require('../../src/subtasks/yamllint');

desc('Testing yamllint', ({ it }) => {
  it('Testing Ok', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'valid.yml'), ['double']);
    expect(await yamllint(logger, dir, ['valid.yml'])).to.equal(undefined);
  });

  it('Testing Error', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'invalid.yml'), [
      'double:',
      '  - value',
      'double:',
      '  - value'
    ], { treatAs: 'txt' });
    try {
      await yamllint(logger, dir, ['invalid.yml']);
    } catch (e) {
      expect(logs.length, `Provided ${logs}`).to.equal(2);
      expect(logs, `Provided ${logs}`).to.deep.equal([
        ['error', 'An error has occurred in: invalid.yml'],
        ['error', 'duplicated mapping key at line 3, column -17:\n    double:\n    ^']
      ]);
    }
  });
});
