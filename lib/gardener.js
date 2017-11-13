const path = require('path');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
const merge = require('lodash.merge');
const defaultsDeep = require('lodash.defaultsdeep');
const defaults = require('lodash.defaults');
const difference = require('lodash.difference');
const yaml = require("node-yaml");
const appRoot = require('app-root-path');

module.exports = (grunt) => {
  const loadConfig = name => grunt.file
    .read(`${__dirname}/conf/${name}`).split("\n")
    // add additional config options from project
    .concat(grunt.file.exists(`./${name}`) ? grunt.file.read(`./${name}`).split("\n") : [])
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
      root: process.cwd()
    });

    const cwd = process.cwd();
    process.chdir(appRoot.path);

    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-project-update');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-yamllint');
    grunt.loadNpmTasks('grunt-depcheck');
    grunt.loadNpmTasks('grunt-check-dependencies');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    process.chdir(options.root);

    // update configuration
    grunt.registerTask('gardener_configure', () => {
      const gitUrl = String(spawnSync('git', ['config', '--get', 'remote.origin.url']).stdout).trim().slice(0, -4);
      const packageFile = path.join(options.root, 'package.json');
      const packageJson = grunt.file.readJSON(packageFile);
      const packageTemplate = JSON.parse(grunt.file
        .read(`${__dirname}/templates/package.json`)
        .replace(/{{GIT_URL}}/g, gitUrl));
      merge(packageJson, packageTemplate.force);
      defaultsDeep(packageJson, packageTemplate.defaults);
      grunt.file.write(packageFile, `${JSON.stringify(packageJson, null, 2)}\n`);

      const travisFile = path.join(options.root, '.travis.yml');
      const travisYml = grunt.file.readYAML(travisFile);
      const travisTemplate = grunt.file.readYAML(`${__dirname}/templates/.travis.yml`);
      defaults(travisYml, travisTemplate);
      yaml.write(travisFile, travisYml);

      ['.gitignore', '.npmignore'].forEach((fileName) => {
        const filePath = `${options.root}/${fileName}`;
        const expected = grunt.file
          .read(`${__dirname}/templates/${fileName}`).split("\n")
          .map(e => e.split("#", 1)[0].trim())
          .filter(e => e !== "");
        const actual = grunt.file
          .read(filePath).split("\n")
          .map(e => e.split("#", 1)[0].trim())
          .filter(e => e !== "");
        fs.appendFileSync(filePath, difference(expected, actual).join("\n"));
      });
    });

    const tasks = {
      mkdir: {
        this: {
          options: {
            create: grunt.file.readJSON(`${__dirname}/templates/folders.json`).map(e => `${options.root}/${e}`)
          }
        }
      },
      copy: {
        this: {
          dot: true,
          expand: true,
          cwd: `${__dirname}/templates/files/`,
          src: `**/*`,
          dest: options.root,
          filter: filepath => !grunt.file.exists(path.join(
            grunt.config.get('copy.this.dest'),
            path.relative(grunt.config.get('copy.this.cwd'), filepath)
          ))
        }
      },
      gardener_configure: {},
      projectUpdate: {
        this: {
          npm: false,
          bower: false,
          commands: [
            { cmd: 'npm', args: ['install'], cwd: options.root },
            { cmd: 'npm', args: ['prune'], cwd: options.root }
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
        this: grunt.file.expand({
          cwd: options.root
        }, [
          '**/*.yml',
          '**/*.yaml',
          '**/.*.yml',
          '**/.*.yaml',
          '!**/node_modules/**/.*',
          '!**/node_modules/**'
        ])
      },
      depcheck: {
        options: {
          withoutDev: false,
          failOnUnusedDeps: true,
          failOnMissingDeps: true,
          listMissing: true,
          ignoreDirs: ['.git', '.svn', '.hg', '.idea', 'node_modules', 'bower_components'],
          ignoreMatches: loadConfig(".depunusedignore")
        },
        this: [
          options.root
        ]
      },
      checkDependencies: {
        this: {
          options: {
            packageManager: 'npm',
            packageDir: options.root,
            onlySpecified: false,
            install: false,
            continueAfterInstall: false
          }
        }
      },
      mocha_istanbul: {
        this: {
          src: [
            `${options.root}/test/*.js`
          ],
          options: {
            check: {
              lines: 100,
              statements: 100,
              branches: 100,
              functions: 100
            },
            excludes: loadConfig(".coverignore"),
            mochaOptions: ['--sort'],
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
