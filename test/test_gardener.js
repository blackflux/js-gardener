const fs = require('fs');
const path = require('path');
const expect = require("chai").expect;
const gardener = require('./../lib/gardener');
const rimraf = require('rimraf');

describe("Testing Gardener", () => {
  // eslint-disable-next-line func-names
  it("Testing Execution", function (done) {
    this.timeout(60000);
    rimraf.sync(path.join(__dirname, 'mock', 'coverage'));
    // change cwd for coverage (we don't need to)
    const savedCwd = process.cwd();
    process.chdir(path.join(__dirname, 'mock'));
    gardener().then(() => {
      const coverage = fs.readFileSync(`${__dirname}/mock/coverage/lcov.info`, 'utf-8');
      expect(coverage).to.contain('test_sum.js');
      process.chdir(savedCwd);
      done();
    });
  });

  it("Testing Skip All", (done) => {
    gardener({
      cwd: path.join(__dirname, 'mock'),
      skip: ['copy', 'package', 'configure', 'badges', 'structure',
        'eslint', 'flow', 'yamllint', 'depcheck', 'depused', 'nyc']
    }).then(() => {
      done();
    });
  });
});
