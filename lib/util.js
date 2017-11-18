const grunt = require('grunt');

module.exports.getTestFiles = folder => grunt.file.expand({
  cwd: folder
}, [
  'test/**/test_*.js',
  '!**/node_modules/**',
  '!**/coverage/**'
]);

module.exports.getYamlFiles = folder => grunt.file.expand({
  cwd: folder
}, [
  '**/*.yml',
  '**/*.yaml',
  '**/.*.yml',
  '**/.*.yaml',
  '!**/node_modules/**/.*',
  '!**/node_modules/**'
]);
