const expect = require("chai").expect;
const hello = require('../lib/hello');

describe("Testing Module", () => it("Testing Addition", () => {
  expect(hello()).to.equal('Hello World');
}));
