const path = require('path');
const sfs = require('smart-fs');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const yamllint = require('../../src/subtasks/yamllint');

describe('Testing yamllint', { useTmpDir: true, record: console }, () => {
  it('Testing Ok', async ({ dir }) => {
    sfs.smartWrite(path.join(dir, 'valid.yml'), ['double']);
    await yamllint(console, dir, ['valid.yml']);
  });

  it('Testing Error', async ({ dir, recorder, capture }) => {
    sfs.smartWrite(path.join(dir, 'invalid.yml'), [
      'double:',
      '  - value',
      'double:',
      '  - value'
    ], { treatAs: 'txt' });
    await capture(() => yamllint(console, dir, ['invalid.yml']));
    expect(recorder.get('error')).to.deep.equal([
      'An error has occurred in: invalid.yml',
      'duplicated mapping key (3:1)\n\n 1 | double:\n 2 |   - value\n 3 | double:\n-----^\n 4 |   - value'
    ]);
  });
});
