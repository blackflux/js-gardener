const fs = require("fs");
const appRoot = require('app-root-path');
const util = require('./util');
const depusedSubtask = require('./subtasks/depused');
const structSubtask = require('./subtasks/struct');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');
const copySubtask = require('./subtasks/copy');
const badgesSubtask = require('./subtasks/badges');

module.exports = (grunt) => {
  const loadConfig = name => util
    .readTextFile(`${__dirname}/conf/${name}`).split("\n")
    // add additional config options from project
    .concat(fs.existsSync(`./${name}`) ? util.readTextFile(`./${name}`).split("\n") : [])
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

    grunt.loadNpmTasks('grunt-project-update');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-yamllint');
    grunt.loadNpmTasks('grunt-check-dependencies');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    process.chdir(options.cwd);

    grunt.registerTask('gardener_copy', () => copySubtask(grunt, options.cwd));
    grunt.registerTask('gardener_package', () => packageSubtask(grunt, options.cwd));
    grunt.registerTask('gardener_configure', () => configureSubtask(grunt, options.cwd));
    grunt.registerTask('gardener_badges', () => badgesSubtask(grunt, options.cwd));
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_structure', function () {
      const done = this.async();
      structSubtask(grunt, options.cwd, loadConfig(".structignore")).then(done);
    });
    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_depused', function () {
      const done = this.async();
      depusedSubtask(grunt, options.cwd, loadConfig(".depunusedignore")).then(done);
    });

    const tasks = {
      gardener_copy: {},
      gardener_package: {},
      gardener_configure: {},
      gardener_badges: {},
      gardener_structure: {},
      projectUpdate: {
        this: {
          npm: false,
          bower: false,
          commands: [
            { cmd: 'npm', args: ['install'], cwd: options.cwd },
            { cmd: 'npm', args: ['prune'], cwd: options.cwd }
          ]
        }
      },
      eslint: {
        options: {
          configFile: `${__dirname}/conf/eslint.json`,
          rulePaths: [`${__dirname}/conf/rules`],
          maxWarnings: 0
        },
        this: [
          '**'
        ].concat(loadConfig(".eslintignore").map(e => `!${e}`))
      },
      yamllint: {
        options: {
          schema: 'DEFAULT_SAFE_SCHEMA'
        },
        this: util.getYamlFiles(options.cwd)
      },
      gardener_depused: {},
      checkDependencies: {
        this: {
          options: {
            packageManager: 'npm',
            packageDir: options.cwd,
            onlySpecified: false,
            install: false,
            continueAfterInstall: false
          }
        }
      },
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
            excludes: loadConfig(".coverignore"),
            mochaOptions: ['--sort'].concat(process.argv.slice(2)
              .filter(e => e === '--debug' || e.startsWith('--filter='))),
            istanbulOptions: ['--include-all-sources', '--default-excludes=false'],
            root: '.'
          },
          reportFormats: ['lcov', 'cobertura', 'lcovonly']
        }
      }
    };
    Object.keys(tasks)
      .filter(e => options.skip.indexOf(e) === -1)
      .forEach(k => gruntRunner(k, tasks[k]));

    process.chdir(cwd);
  });
};
