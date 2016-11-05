var doc = require('./api-doc');
var glob = require('glob');

function getFileNames() {
  return glob.sync('src/**/*.ts', {
    ignore: ['src/**/*.spec.ts', 'src/util/**']
  });
}

function getApiDocs() {
  return doc(getFileNames());
}

module.exports = getApiDocs;
