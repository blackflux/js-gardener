const path = require("path");
const fs = require('fs');
const get = require('lodash.get');
const defaults = require('lodash.defaults');
const difference = require('lodash.difference');
const yaml = require("js-yaml");
const util = require("./../util");

const updateStruct = (cwd, files, converter) => files.forEach((fileName) => {
  const filePath = path.join(cwd, fileName);
  const expected = converter[0](fs.readFileSync(path
    .join(__dirname, "..", "templates", "overwrite", `dot${fileName}`), 'utf8'));
  const actual = converter[0](fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, converter[1](defaults(actual, expected)), 'utf8');
  fs.appendFileSync(filePath, "\n");
});

const updateSequential = (cwd, folders) => folders.forEach((fileName) => {
  const filePath = path.join(cwd, fileName);
  const expected = util.readListFile(path.join(__dirname, "..", "templates", "overwrite", `dot${fileName}`));
  const actual = util.readListFile(filePath);
  fs.appendFileSync(filePath, difference(expected, actual).join("\n"));
});

// rewrite configuration files
module.exports = (logger, cwd, config) => {
  const toSkip = get(config, "skip", []);
  const tasks = {
    json: ['.babelrc'],
    yaml: ['.travis.yml', '.circleci/config.yml'],
    seq: ['.gitignore', '.npmignore']
  };

  updateStruct(cwd, tasks.json.filter(f => toSkip.indexOf(f) === -1), [JSON.parse, e => JSON.stringify(e, null, 2)]);
  updateStruct(cwd, tasks.yaml.filter(f => toSkip.indexOf(f) === -1), [yaml.safeLoad, yaml.safeDump]);
  updateSequential(cwd, tasks.seq.filter(f => toSkip.indexOf(f) === -1));

  return Promise.resolve();
};
