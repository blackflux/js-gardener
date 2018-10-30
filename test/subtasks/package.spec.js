const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const tmp = require('tmp');
const pkg = require('../../src/subtasks/package');

tmp.setGracefulCleanup();

describe('Testing package', () => {
  let dir;
  beforeEach(() => {
    dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
  });

  it('Testing Copy', () => {
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      repository: {
        type: 'git',
        url: 'git+https://github.com/blackflux/js-gardener.git'
      }
    }, null, 2));
    const expectedError = 'Repository Url required to start with https://';
    const msgs = [];
    expect(() => pkg({ error: msg => msgs.push(msg) }, dir, { license: 'MIT' })).to.throw(expectedError);
    expect(msgs).to.deep.equal([expectedError]);
  });
});
