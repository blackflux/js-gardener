const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const expect = require('chai').expect;
const gardener = require('./../src/gardener');

const logs = [];
const logErrorOriginal = log.error;

describe('Testing Gardener', () => {
  beforeEach(() => {
    logs.length = 0;
    log.error = e => logs.push(e);
  });

  afterEach(() => {
    log.error = logErrorOriginal;
  });

  it('Testing Defaults', (done) => {
    // change cwd for coverage (so we can invoke with no parameters)
    const savedCwd = process.cwd();
    process.chdir(path.join(__dirname, 'mock'));
    gardener().catch(() => {
      expect(logs, `Provided: ${logs}`).to.deep
        .equal(['Unused/Not Installed Dependencies: @babel/cli, @babel/core, coveralls, nyc, semantic-release']);
      process.chdir(savedCwd);
      done();
    });
  }).timeout(60000);

  it('Testing Not in Docker', () => {
    const fsExistsSyncOriginal = fs.existsSync;
    fs.existsSync = () => false;
    expect(() => gardener({ docker: true })).to.throw('Please run in Docker');
    fs.existsSync = fsExistsSyncOriginal;
  });

  it('Testing in Docker', () => {
    const fsExistsSyncOriginal = fs.existsSync;
    fs.existsSync = () => true;
    expect(() => gardener({
      docker: true,
      skip: ['copy', 'configure', 'structure',
        'audit', 'eslint', 'yamllint', 'depcheck', 'depused']
    })).to.not.throw('Please run in Docker');
    fs.existsSync = fsExistsSyncOriginal;
  });

  it('Testing Skip All', (done) => {
    gardener({
      cwd: path.join(__dirname, 'mock'),
      skip: ['robo', 'copy', 'configure', 'structure',
        'audit', 'eslint', 'yamllint', 'depcheck', 'depused']
    }).then(() => {
      done();
    }).catch(done);
  });
});
