const path = require('path');
const expect = require("chai").expect;
const depused = require('../../lib/checks/depused');

const logs = [];
const grunt = { log: { error: e => logs.push(e[0]) } };


describe("Testing depused", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Unnecessary Suppressed", (done) => {
    depused(
      grunt,
      path.join(__dirname, "..", "mock"),
      ["unnecessary"]
    ).then((r) => {
      expect(r).to.equal(false);
      expect(logs, `Provided ${logs}`).to.contain('Undetected Unused Dependencies: unnecessary');
      done();
    });
  });

  it("Testing Unused", (done) => {
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
