const fs = require('fs');
const path = require('path');
const log = require('fancy-log');
const sfs = require('smart-fs');
const expect = require('chai').expect;
const desc = require('./util/desc');
const gardener = require('./../src/index');

desc('Testing Integration', ({ it, beforeEach, afterEach }) => {
  const logs = [];
  const logErrorOriginal = log.error;

  let fsExistsSyncOriginal;

  beforeEach(({ dir }) => {
    fsExistsSyncOriginal = fs.existsSync;
    logs.length = 0;
    log.error = e => logs.push(e);
  });

  afterEach(() => {
    log.error = logErrorOriginal;
    fs.existsSync = fsExistsSyncOriginal;
  });

  it('Testing Ok', async ({ dir }) => {
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    sfs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      sfs.smartRead(path.join(__dirname, '..', '.eslintrc.json'))
    );
    sfs.smartWrite(path.join(dir, 'package.json'), {
      name: 'pkg',
      dependencies: {
        '@babel/register': '1.0.0'
      },
      main: 'index.js'
    });
    expect(await gardener({ cwd: dir })).to.equal(undefined);
  }).timeout(30000);

  it('Testing Failure', async ({ dir }) => {
    const savedCwd = process.cwd();
    process.chdir(dir);
    try {
      await gardener();
    } catch (e) {
      expect(e.message).to.equal(`Configuration File missing: ${dir}/.roboconfig`);
    } finally {
      process.chdir(savedCwd);
    }
  });

  it('Testing Not in Docker', ({ dir }) => {
    fs.existsSync = () => false;
    expect(() => gardener({ docker: true, cwd: dir })).to.throw('Please run in Docker');
  });

  it('Testing in Docker', ({ dir }) => {
    fs.existsSync = () => true;
    expect(() => gardener({
      docker: true,
      cwd: dir,
      skip: ['robo', 'structure', 'audit', 'eslint', 'yamllint', 'depcheck', 'depused']
    })).to.not.throw('Please run in Docker');
  });
});
