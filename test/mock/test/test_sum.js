const expect = require("chai").expect;
const sum = require('../lib/sum');

describe("Testing Module", () => it("Testing Addition", () => {
  expect(sum(3, 6)).to.equal(9);
}));
