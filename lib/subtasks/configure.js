const path = require("path");
const fs = require('fs');
const defaults = require('lodash.defaults');
const difference = require('lodash.difference');
const yaml = require("node-yaml");
const util = require("./../util");

// rewrite configuration files
module.exports = (grunt, cwd) => {
  // update yml files
  ['.travis.yml'].forEach((fileName) => {
    const filePath = path.join(cwd, fileName);
    const expected = yaml.readSync(path.join(__dirname, "..", "templates", `dot${fileName}`));
    const actual = yaml.readSync(filePath);
    yaml.write(filePath, defaults(actual, expected));
    fs.appendFileSync(filePath, "\n");
  });

  // update list files
  ['.gitignore', '.npmignore'].forEach((fileName) => {
    const filePath = path.join(cwd, fileName);
    const expected = util.readListFile(path.join(__dirname, "..", "templates", `dot${fileName}`));
    const actual = util.readListFile(filePath);
    fs.appendFileSync(filePath, difference(expected, actual).join("\n"));
  });
};
