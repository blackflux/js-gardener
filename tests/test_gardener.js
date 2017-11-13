const path = require('path');
const expect = require("chai").expect;
const grunt = require('grunt');
const gardener = require('../lib/gardener');
const rimraf = require('rimraf');

describe("Testing Gardener", () => {
  // eslint-disable-next-line func-names
  it("Testing Execution", function (done) {
    this.timeout(60000);
    rimraf.sync(path.join(__dirname, 'mock', 'coverage'));
    grunt.config.init({
      silently: true,
      gardener: {
        this: {
          options: {
            root: path.join(__dirname, 'mock')
          }
        }
      }
    });
    gardener(grunt);
    grunt.tasks(['gardener'], {
      cwd: __dirname,
      gruntfile: __filename,
      color: false
    }, () => {
      const coverage = grunt.file.read(`${__dirname}/mock/coverage/lcov.info`);

      expect(coverage).to.contain('test_hello.js');
      done();
    });
  });
});
