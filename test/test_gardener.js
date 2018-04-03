const fs = require('fs');
const path = require('path');
const expect = require("chai").expect;
const gardener = require('../lib/gardener');
const rimraf = require('rimraf');

describe("Testing Gardener", () => {
  // eslint-disable-next-line func-names
  it("Testing Execution", function (done) {
    this.timeout(60000);
    rimraf.sync(path.join(__dirname, 'mock', 'coverage'));
    gardener({ cwd: path.join(__dirname, 'mock') }).then(() => {
      const coverage = fs.readFileSync(`${__dirname}/mock/coverage/lcov.info`, 'utf-8');
      expect(coverage).to.contain('test_hello.js');
      done();
    });
  });
});
