const path = require('path');
const expect = require('chai').expect;
const depused = require('../../src/subtasks/depused');

const logs = [];
const logger = { error: e => logs.push(e) };


describe('Testing depused', () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it('Testing Unnecessary Suppressed', (done) => {
    depused(
      logger,
      path.join(__dirname, '..', 'mock'),
      ['unnecessary']
    ).catch(() => {
      expect(logs, `Provided ${logs}`).to.contain('Suppressed, detected Dependencies: unnecessary');
      done();
    });
  }).timeout(30000);

  // eslint-disable-next-line func-names
  it('Testing Unused', (done) => {
    depused(
      logger,
      path.join(__dirname, '..', '..'),
      []
    ).catch(() => {
      expect(logs, `Provided ${logs}`)
        .to.contain('Unused/Not Installed Dependencies: @babel/register, eslint-config-airbnb-base');
      done();
    });
  }).timeout(60000);

  // eslint-disable-next-line func-names
  it('Testing Ok', (done) => {
    depused(
      logger,
      path.join(__dirname, '..', '..'),
      ['eslint-config-airbnb-base', '@babel/register']
    ).then(() => {
      expect(logs.length).to.equal(0);
      done();
    }).catch(done.fail);
  }).timeout(60000);
});
