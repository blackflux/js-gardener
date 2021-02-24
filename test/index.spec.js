const fs = require('fs');
const path = require('path');
const fancyLog = require('fancy-log');
const sfs = require('smart-fs');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const gardener = require('../src/index');

describe('Testing Integration', { useTmpDir: true, record: fancyLog, timeout: 30000 }, () => {
  let fsExistsSyncOriginal;
  before(() => {
    fsExistsSyncOriginal = fs.existsSync;
  });
  after(() => {
    fs.existsSync = fsExistsSyncOriginal;
  });

  it('Testing Ok', async ({ dir }) => {
    sfs.smartWrite(path.join(dir, '.roboconfig.json'), {});
    sfs.smartWrite(
      path.join(dir, '.eslintrc.json'),
      sfs.smartRead(path.join(__dirname, '..', '.eslintrc.json'))
    );
    fs.symlinkSync(
      path.join(__dirname, '..', 'node_modules'),
      path.join(dir, 'node_modules')
    );
    sfs.smartWrite(path.join(dir, 'package.json'), {
      name: 'pkg',
      dependencies: {
        '@babel/register': '1.0.0'
      },
      main: 'index.js'
    });
    expect(await gardener({ cwd: dir })).to.equal(undefined);
  });

  it('Testing Failure', async ({ dir, capture }) => {
    const savedCwd = process.cwd();
    process.chdir(dir);
    const e = await capture(() => gardener());
    expect(e.message).to.equal(`Configuration File missing: ${dir}/.roboconfig`);
    process.chdir(savedCwd);
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
      skip: ['robo', 'structure', 'eslint', 'yamllint', 'depcheck', 'depused']
    })).to.not.throw('Please run in Docker');
  });
});
