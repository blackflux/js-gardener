const path = require('path');
const expect = require('chai').expect;
const depused = require('../../src/subtasks/depused');

const logs = [];
const logger = { error: e => logs.push(e) };

describe('Testing depused', () => {
  beforeEach(() => {
    logs.length = 0;
  });

  // eslint-disable-next-line func-names
  it('Testing Unnecessary Suppressed', function(done) {
    this.timeout(30000);
    depused(logger, path.join(__dirname, '..', 'mock'), ['unnecessary']).catch(() => {
      expect(logs, `Provided ${logs}`).to.contain('Suppressed, detected Dependencies: unnecessary');
      done();
    });
  });

  // eslint-disable-next-line func-names
  it('Testing Unused', function(done) {
    this.timeout(60000);
    depused(logger, path.join(__dirname, '..', '..'), []).catch(() => {
      expect(logs, `Provided ${logs}`).to.contain(
        'Unused/Not Installed Dependencies: eslint-config-airbnb-base, prettier'
      );
      done();
    });
  });

  // eslint-disable-next-line func-names
  it('Testing Ok', function(done) {
    this.timeout(60000);
    depused(logger, path.join(__dirname, '..', '..'), ['eslint-config-airbnb-base', 'prettier'])
      .then(() => {
        expect(logs.length).to.equal(0);
        done();
      })
      .catch(done.fail);
  });
});
