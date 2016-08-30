var doc = require('./api-doc');
var glob = require('glob');

function getFileNames() {
  return glob.sync('src/**/*.ts', {
    ignore: ['src/**/*.spec.ts', 'src/util/**']
  }).concat(glob.sync('typings/**/*d.ts'));
}

function getApiDocs() {
  return doc(getFileNames());
}

module.exports = getApiDocs;
