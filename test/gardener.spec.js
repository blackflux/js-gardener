const path = require('path');
const expect = require("chai").expect;
const gardener = require('./../src/gardener');
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
  it("Testing Defaults", function (done) {
    this.timeout(60000);
    // change cwd for coverage (because we exit with exception!)
    const savedCwd = process.cwd();
    process.chdir(path.join(__dirname, 'mock'));
    gardener().catch(() => {
      expect(logs).to.deep.equal(['Unused/Not Installed Dependencies: coveralls, nyc, semantic-release']);
      process.chdir(savedCwd);
      done();
    });
  });

  // eslint-disable-next-line func-names
  it("Testing CircleCI and no NPM", function (done) {
    this.timeout(60000);
    // change cwd for coverage (because we exit with exception!)
    const savedCwd = process.cwd();
    process.chdir(path.join(__dirname, 'mock'));
    gardener({
      ci: ["circle"],
      npm: false,
      cwd: path.join(__dirname, 'mock')
    }).catch(() => {
      expect(logs).to.deep.equal(['Unused/Not Installed Dependencies: coveralls, nyc, semantic-release']);
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
