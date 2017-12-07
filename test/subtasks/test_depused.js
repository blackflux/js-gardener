const path = require('path');
const expect = require("chai").expect;
const depused = require('../../lib/subtasks/depused');

const logs = [];
const grunt = { log: { error: e => logs.push(e[0]) } };


describe("Testing depused", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  // eslint-disable-next-line func-names
  it("Testing Unnecessary Suppressed", function (done) {
    this.timeout(30000);
    depused(
      grunt,
      path.join(__dirname, "..", "mock"),
      ["unnecessary"]
    ).then((r) => {
      expect(r).to.equal(false);
      expect(logs, `Provided ${logs}`).to.contain('Suppressed, detected Dependencies: unnecessary');
      done();
    });
  });

  // eslint-disable-next-line func-names
  it("Testing Unused", function (done) {
    this.timeout(30000);
    depused(
      grunt,
      path.join(__dirname, "..", ".."),
      []
    ).then((r) => {
      expect(r).to.equal(false);
      expect(logs, `Provided ${logs}`).to.contain('Unused Dependencies: eslint-config-airbnb-base, istanbul');
      done();
    });
  });
});
