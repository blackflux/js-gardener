const expect = require("chai").expect;
const tmp = require('tmp');
const copy = require('../../src/subtasks/copy');

const logs = [];
const logger = { info: e => logs.push(e) };

tmp.setGracefulCleanup();

describe("Testing copy", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Copy", (done) => {
    const dir = tmp.dirSync({ keep: false, unsafeCleanup: true }).name;
    // all files are copied
    copy(logger, dir, {}).then(() => {
      expect(logs.length).to.equal(1);
      expect(logs[0].sort()).to.deep.equal([
        'dot.babelrc',
        'dot.editorconfig',
        'dot.flowconfig',
        'dot.gitignore',
        'dot.npmignore',
        'dot.travis.yml',
        'dot.circleci',
        'dot.circleci/config.yml',
        'LICENSE',
        'README.md',
        'test',
        'src',
        'test/mocha.opts'
      ].sort());
      // no files are copied
      copy(logger, dir, []).then(() => {
        expect(logs.length).to.equal(1);
        done();
      });
    });
  });
});
