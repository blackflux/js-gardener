const fs = require("fs");
const appRoot = require('app-root-path');
const util = require('./util');
const copySubtask = require('./subtasks/copy');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');
const badgesSubtask = require('./subtasks/badges');
const structSubtask = require('./subtasks/struct');
const eslintSubtask = require('./subtasks/eslint');
const flowSubtask = require('./subtasks/flow');
const depcheckSubtask = require('./subtasks/depcheck');
const depusedSubtask = require('./subtasks/depused');

module.exports = (grunt) => {
  const loadConfig = (cwd, name) => util
    .readTextFile(`${__dirname}/conf/${name}`).split("\n")
    // add additional config options from project
    .concat(fs.existsSync(`${cwd}/${name}`) ? util.readTextFile(`${cwd}/${name}`).split("\n") : [])
    .map(e => e.split("#", 1)[0].trim())
    .filter(e => e !== "");

  const gruntRunner = (task, cfg) => {
    const cfgOriginal = grunt.config.getRaw();
    grunt.config.set(task, cfg);
    grunt.task.run(task);
    grunt.config.init(cfgOriginal);
  };

  // eslint-disable-next-line func-names
  grunt.registerMultiTask('gardener', function () {
    const options = this.options({
      skip: [],
      cwd: process.cwd()
    });

    const cwd = process.cwd();
    process.chdir(appRoot.path);
    grunt.loadNpmTasks('grunt-yamllint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    process.chdir(options.cwd);
    grunt.registerTask('_restore_cwd', () => process.chdir(cwd));

    grunt.registerTask('gardener_copy', () => copySubtask(grunt, options.cwd));
    grunt.registerTask('gardener_package', () => packageSubtask(grunt, options.cwd));
    grunt.registerTask('gardener_configure', () => configureSubtask(grunt, options.cwd));
    grunt.registerTask('gardener_badges', () => badgesSubtask(grunt, options.cwd));
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_structure', function () {
      const done = this.async();
      structSubtask(grunt, options.cwd, loadConfig(options.cwd, ".structignore")).then(done);
    });
    grunt.registerTask('gardener_eslint', () => eslintSubtask(grunt, options.cwd, util
      .getEsLintFiles(options.cwd, loadConfig(options.cwd, ".eslintignore")), options.rules));
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_flow', function () {
      const done = this.async();
      flowSubtask(grunt, options.cwd).then(done);
    });
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_depcheck', function () {
      const done = this.async();
      depcheckSubtask(grunt, options.cwd).then(done);
    });
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_depused', function () {
      const done = this.async();
      depusedSubtask(grunt, options.cwd, loadConfig(options.cwd, ".depunusedignore")).then(done);
    });

    const tasks = {
      gardener_copy: {},
      gardener_package: {},
      gardener_configure: {},
      gardener_badges: {},
      gardener_structure: {},
      gardener_eslint: {},
      gardener_flow: {},
      yamllint: {
        options: {
          schema: 'DEFAULT_SAFE_SCHEMA'
        },
        this: util.getYamlFiles(options.cwd)
      },
      gardener_depcheck: {},
      gardener_depused: {},
      mocha_istanbul: {
        this: {
          src: util.getTestFiles(options.cwd),
          options: {
            check: {
              lines: 100,
              statements: 100,
              branches: 100,
              functions: 100
            },
            excludes: loadConfig(options.cwd, ".coverignore"),
            mochaOptions: ['--sort'].concat(process.argv.slice(2)
              .filter(e => e === '--debug' || e.startsWith('--filter='))),
            istanbulOptions: ['--include-all-sources', '--default-excludes=false'],
            root: '.'
          },
          reportFormats: ['lcov', 'cobertura', 'lcovonly']
        }
      },
      _restore_cwd: {}
    };
    Object.keys(tasks)
      .filter(e => options.skip.indexOf(e) === -1)
      .forEach(k => gruntRunner(k, tasks[k]));
  });
};
