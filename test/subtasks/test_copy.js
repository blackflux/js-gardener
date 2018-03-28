const expect = require("chai").expect;
const tmp = require('tmp');
const copy = require('../../lib/subtasks/copy');

tmp.setGracefulCleanup();

describe("Testing copy", () => {
  it("Testing Copy", () => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    // all files are copied
    expect(copy(null, dir).sort()).to.deep.equal([
      'dot.editorconfig',
      'dot.flowconfig',
      'dot.gitignore',
      'dot.npmignore',
      'dot.travis.yml',
      'LICENSE',
      'README.md',
      'test',
      'lib',
      'test/mocha.opts'
    ].sort());
    // no files are copied
    expect(copy(null, dir)).to.deep.equal([]);
  });
});
