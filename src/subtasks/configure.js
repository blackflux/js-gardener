const path = require('path');
const fs = require('fs');
const get = require('lodash.get');
const defaults = require('lodash.defaults');
const difference = require('lodash.difference');
const yaml = require('js-yaml');
const xml2js = require('xml2js');
const objectScan = require('object-scan');
const util = require('./../util');

const xmlBuilder = new xml2js.Builder();

const updateIdeaConfig = (cwd) => {
  // update *.iml files in .idea folder
  fs.readdirSync(path.join(cwd, '.idea'))
    .filter(f => f.endsWith('.iml'))
    .map(f => path.join(cwd, '.idea', f))
    .forEach((f) => {
      const imlData = fs.readFileSync(f);
      xml2js.parseString(imlData, (err, result) => {
        objectScan(
          ['module.component[*].content[*].excludeFolder'],
          { joined: false }
        )(result).forEach((excludeFolderKey) => {
          const entries = get(result, excludeFolderKey);
          if (Array.isArray(entries) && !entries.some(e => get(e, ['$', 'url']) === 'file://$MODULE_DIR$/coverage')) {
            entries.push({ $: { url: 'file://$MODULE_DIR$/coverage' } });
          }
        });
        fs.writeFileSync(f, xmlBuilder.buildObject(result), 'utf8');
      });
    });
};

const updateStruct = (cwd, files, converter) => files.forEach((fileName) => {
  const filePath = path.join(cwd, fileName);
  const expected = converter[0](fs.readFileSync(path
    .join(__dirname, '..', 'templates', 'merge', `dot${fileName}`), 'utf8'));
  const actual = converter[0](fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(filePath, converter[1](defaults(actual, expected)).trim('\n'), 'utf8');
  fs.appendFileSync(filePath, '\n');
});

const updateSequential = (cwd, folders) => folders.forEach((fileName) => {
  const filePath = path.join(cwd, fileName);
  const expected = util.readListFile(path.join(__dirname, '..', 'templates', 'merge', `dot${fileName}`));
  const actual = util.readListFile(filePath);
  fs.appendFileSync(filePath, difference(expected, actual).join('\n'));
});

// rewrite configuration files
module.exports = (logger, cwd, config) => {
  const toSkip = get(config, 'skip', []);
  const tasks = {
    json: ['.babelrc', '.releaserc.json'],
    yaml: ['.travis.yml', '.circleci/config.yml'],
    seq: ['.gitignore', '.npmignore']
  };
  const filteredTasks = Object.keys(tasks)
    .reduce((p, c) => Object.assign(p, { [c]: tasks[c].filter(f => toSkip.indexOf(f) === -1) }), {});

  updateIdeaConfig(cwd);
  updateStruct(cwd, filteredTasks.json, [JSON.parse, e => JSON.stringify(e, null, 2)]);
  updateStruct(cwd, filteredTasks.yaml, [yaml.safeLoad, yaml.safeDump]);
  updateSequential(cwd, filteredTasks.seq);

  return Promise.resolve();
};
