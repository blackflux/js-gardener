const path = require('path');
const expect = require("chai").expect;
const struct = require('../../src/subtasks/struct');

const logs = [];
const logger = { error: e => logs.push(e) };
const projectFolder = path.join(__dirname, "..", "..");

describe("Testing struct", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing Success", (done) => {
    struct(logger, projectFolder, ["test/mock/test/sum.spec.js"]).then(() => {
      expect(logs.length, `Provided ${logs}`).to.equal(0);
      expect(logs, `Provided ${logs}`).to.deep.equal([]);
      done();
    });
  });

  it("Testing Failure", (done) => {
    struct(logger, projectFolder, []).catch((r) => {
      expect(logs.length, `Provided ${logs}`).to.equal(1);
      expect(logs[0], `Provided ${logs}`).to.contain('sum.js to exist for ');
      expect(logs[0], `Provided ${logs}`).to.contain('sum.spec.js');
      done();
    });
  });
});
