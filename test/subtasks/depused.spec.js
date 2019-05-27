const path = require('path');
const sfs = require('smart-fs');
const expect = require('chai').expect;
const desc = require('../util/desc');
const depused = require('../../src/subtasks/depused');

desc('Testing depused', ({ it }) => {
  it('Testing Ok', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {});
    await depused(logger, dir, []);
    expect(logs.length).to.equal(0);
  }).timeout(60000);

  it('Testing Unnecessary Suppressed', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {});
    const deps = ['@babel/register'];
    try {
      await depused(logger, dir, deps);
    } catch (e) {
      expect(logs, `Provided ${logs}`)
        .to.deep.contain(['error', `Suppressed, not installed Dependencies: ${deps.join(',')}`]);
    }
  }).timeout(60000);

  it('Testing Unused', async ({ dir, logger, logs }) => {
    sfs.smartWrite(path.join(dir, 'package.json'), {
      name: 'pkg',
      dependencies: {
        'object-scan': '1.0.0'
      },
      main: 'index.js'
    });
    try {
      await depused(logger, dir, []);
    } catch (e) {
      expect(logs, `Provided ${logs}`)
        .to.deep.contain(['error', 'Unused/Not Installed Dependencies: object-scan']);
    }
  }).timeout(60000);
});
