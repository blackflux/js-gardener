const path = require('path');
const expect = require("chai").expect;
const gardener = require('./../lib/gardener');
const log = require("fancy-log");

const logs = [];
const logErrorOriginal = log.error;

describe("Testing Gardener", () => {
  beforeEach(() => {
    logs.length = 0;
    log.error = e => logs.push(e);
  });

  afterEach(() => {
    log.error = logErrorOriginal;
  });

  // eslint-disable-next-line func-names
  it("Testing Execution", function (done) {
    this.timeout(60000);
    // change cwd for coverage (we don't need to)
    const savedCwd = process.cwd();
    process.chdir(path.join(__dirname, 'mock'));
    gardener().catch(() => {
      expect(logs).to.deep.equal(['Unused Dependencies: coveralls, nyc, semantic-release']);
      process.chdir(savedCwd);
      done();
    });
  });

  it("Testing Skip All", (done) => {
    gardener({
      cwd: path.join(__dirname, 'mock'),
      skip: ['copy', 'package', 'configure', 'badges', 'structure',
        'eslint', 'flow', 'yamllint', 'depcheck', 'depused']
    }).then(() => {
      done();
    });
  });
});
