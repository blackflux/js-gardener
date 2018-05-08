const fs = require('fs');
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
    // change cwd for coverage (so we can invoke with no parameters)
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
    gardener({
      ci: ["circle"],
      npm: false,
      cwd: path.join(__dirname, 'mock')
    }).catch(() => {
      expect(logs).to.deep.equal(['Unused/Not Installed Dependencies: coveralls, nyc, semantic-release']);
      done();
    });
  });

  it("Testing Invalid License", () => {
    expect(() => gardener({
      license: "Invalid"
    })).to.throw("Invalid license provided!");
  });

  it("Testing Not in Docker", () => {
    let fsExistsSyncOriginal = fs.existsSync;
    fs.existsSync = () => false;
    expect(() => gardener({
      lambda: true
    })).to.throw("Please run in Docker using \". manage.sh\"");
    fs.existsSync = fsExistsSyncOriginal;
  });

  it("Testing in Docker", () => {
    let fsExistsSyncOriginal = fs.existsSync;
    fs.existsSync = () => true;
    expect(() => gardener({
      lambda: true,
      skip: ['copy', 'package', 'configure', 'badges', 'structure',
        'eslint', 'flow', 'yamllint', 'depcheck', 'depused']
    })).to.not.throw("Please run in Docker using \". manage.sh\"");
    fs.existsSync = fsExistsSyncOriginal;
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
