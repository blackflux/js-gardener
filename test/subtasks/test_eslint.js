const path = require('path');
const expect = require("chai").expect;
const eslint = require('../../lib/subtasks/eslint');

const logs = [];
const logger = { error: e => logs.push(e), info: e => logs.push(e) };
const projectFolder = path.join(__dirname, "..", "..");

describe("Testing eslint", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing No Files", (done) => {
    eslint(logger, projectFolder, []).catch((result) => {
      expect(String(result)).to.deep.contain("No ESLint files found.");
      done();
    });
  });

  it("Testing Exception", (done) => {
    eslint(logger, null, ["file"]).catch((result) => {
      expect(String(result)).to.contain("TypeError");
      done();
    });
  });

  it("Testing Invalid File", (done) => {
    eslint(logger, projectFolder, [path.join(projectFolder, "LICENSE")]).catch((result) => {
      expect(String(result)).to.contain("1 problem (1 error, 0 warnings)");
      expect(String(logs)).to.contain("1 problem (1 error, 0 warnings)");
      done();
    });
  });
});
