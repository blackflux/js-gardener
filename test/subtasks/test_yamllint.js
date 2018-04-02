const path = require('path');
const expect = require("chai").expect;
const yamllint = require('../../lib/subtasks/yamllint');

const logs = [];
const grunt = { log: { error: e => logs.push(e[0]) } };
const projectFolder = path.join(__dirname, "..", "..");

describe("Testing yamllint", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Error", (done) => {
    yamllint(grunt, projectFolder, ["test/invalid.yml.raw"]).then((r) => {
      expect(r, `Provided ${logs}`).to.equal(false);
      expect(logs.length, `Provided ${logs}`).to.equal(2);
      expect(logs, `Provided ${logs}`).to.deep.equal([
        "An error has occurred in: test/invalid.yml.raw",
        "duplicated mapping key at line 3, column -17:\n    double:\n    ^"
      ]);
      done();
    });
  });
});
