const path = require('path');
const expect = require("chai").expect;
const eslint = require('../../lib/subtasks/eslint');

const logs = [];
const grunt = { log: { error: e => logs.push(e[0]) } };
const projectFolder = path.join(__dirname, "..", "..");

describe("Testing eslint", () => {
  beforeEach(() => {
    logs.length = 0;
  });

  it("Testing No Files", () => {
    const result = eslint(grunt, projectFolder, []);
    expect(result).to.equal(false);
    expect(logs).to.deep.equal(["No ESLint files found."]);
  });

  it("Testing Exception", () => {
    const result = eslint(grunt, null, ["file"]);
    expect(result).to.equal(false);
    expect(String(logs)).to.contain("TypeError: Path must be a string");
  });

  it("Testing Invalid File", () => {
    /* eslint-disable no-console */
    const consoleLogOriginal = console.log;
    const consoleLogs = [];
    console.log = (...args) => {
      consoleLogs.push(...args);
    };
    const result = eslint(grunt, projectFolder, [path.join(projectFolder, "LICENSE")]);
    console.log = consoleLogOriginal;
    expect(result).to.equal(false);
    expect(String(consoleLogs)).to.contain("1 problem (1 error, 0 warnings)");
    /* eslint-enable no-console */
  });
});
