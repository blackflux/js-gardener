const path = require('path');
const appRoot = require('app-root-path');
const util = require('./util');
const depusedSubtask = require('./subtasks/depused');
const structSubtask = require('./subtasks/struct');
const packageSubtask = require('./subtasks/package');
const configureSubtask = require('./subtasks/configure');

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
      cwd: process.cwd()
    });

    const cwd = process.cwd();
    process.chdir(appRoot.path);

    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-project-update');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-yamllint');
    grunt.loadNpmTasks('grunt-check-dependencies');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    process.chdir(options.cwd);

    // update package.json
    grunt.registerTask('gardener_package', () => packageSubtask(grunt, options.cwd));

    // update configuration
    grunt.registerTask('gardener_configure', () => configureSubtask(grunt, options.cwd));

    // insert badges
    grunt.registerTask('gardener_badges', () => {
      const gitUrl = util.getGitUrl(options.cwd);
      const badges = grunt.file
        .readJSON(`${__dirname}/templates/badges.json`)
        .reduce((obj, badge) => Object.assign(obj, {
          [
          badge
            .replace(/{{USER_NAME}}/g, gitUrl.split("/").reverse()[1])
            .replace(/{{REPO_NAME}}/g, gitUrl.split("/").reverse()[0])
          ]: new RegExp(badge
            .replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")
            .replace(/\\{\\{USER_NAME\\}\\}/g, '[a-zA-Z0-9_-]+?')
            .replace(/\\{\\{REPO_NAME\\}\\}/g, '[a-zA-Z0-9_-]+?'))
        }), {});
      const readmeFile = path.join(options.cwd, 'README.md');
      const readmeMd = grunt.file.read(readmeFile);
      const prepend = Object.keys(badges)
        .filter(badge => !readmeMd.match(badges[badge]))
        .join("\n");
      grunt.file.write(readmeFile, `${prepend}${readmeMd}`);
    });

    // eslint-disable-next-line func-names
    grunt.registerTask('gardener_structure', function () {
      const done = this.async();
      structSubtask(grunt, options.cwd, loadConfig(".structignore")).then(done);
    });

    // eslint-disable-next-line func-names
    grunt.registerTask('depused', function () {
      const done = this.async();
      depusedSubtask(grunt, options.cwd, loadConfig(".depunusedignore")).then(done);
    });

    const tasks = {
      mkdir: {
        this: {
          options: {
            create: grunt.file.readJSON(`${__dirname}/templates/folders.json`).map(e => `${options.cwd}/${e}`)
          }
        }
      },
      copy: {
        this: {
          dot: true,
          expand: true,
          cwd: `${__dirname}/templates/files/`,
          src: `**/*`,
          dest: options.cwd,
          filter: filepath => !fs.existsSync(path.join(
            grunt.config.get('copy.this.dest'),
            path.relative(grunt.config.get('copy.this.cwd'), filepath)
          )),
          rename: (dir, file) => path.join(dir, file.replace(/^(dot(?=\.))(.*?)$/g, '$2'))
        }
      },
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
      depused: {},
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
