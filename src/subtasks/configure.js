const path = require("path");
const fs = require('fs');
const get = require('lodash.get');
const defaults = require('lodash.defaults');
const difference = require('lodash.difference');
const yaml = require("node-yaml");
const util = require("./../util");

// rewrite configuration files
module.exports = (logger, cwd, config) => {
  const toSkip = get(config, "skip", []);
  // update yml files
  ['.travis.yml', '.circleci/config.yml']
    .filter(f => toSkip.indexOf(f) === -1)
    .forEach((fileName) => {
      const filePath = path.join(cwd, fileName);
      const expected = yaml.readSync(path.join(__dirname, "..", "templates", "overwrite", `dot${fileName}`));
      const actual = yaml.readSync(filePath);
      yaml.write(filePath, defaults(actual, expected));
      fs.appendFileSync(filePath, "\n");
    });

  // update list files
  ['.gitignore', '.npmignore']
    .filter(f => toSkip.indexOf(f) === -1)
    .forEach((fileName) => {
      const filePath = path.join(cwd, fileName);
      const expected = util.readListFile(path.join(__dirname, "..", "templates", "overwrite", `dot${fileName}`));
      const actual = util.readListFile(filePath);
      fs.appendFileSync(filePath, difference(expected, actual).join("\n"));
    });

  return Promise.resolve();
};
