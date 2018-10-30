const path = require('path');
const tmp = require('tmp');
const expect = require('chai').expect;
const util = require('./../src/util');

describe('Testing Util', () => {
  it('Testing loadConfig', () => {
    const result = util.loadConfig(path.join(__dirname, '..'), '.structignore');
    expect(result).to.deep.equal(['test/mock/test/sum.spec.js']);
  });

  it('Testing git remote url extraction', () => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    const result = util.getGitUrl(dir);
    expect(result).to.equal(null);
  });
});
