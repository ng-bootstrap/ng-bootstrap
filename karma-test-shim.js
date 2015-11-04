// Tun on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.config({
  packages: {
    'base/temp': {
      defaultExtension: false,
      format: 'cjs',
      map: Object.keys(window.__karma__.files).filter(onlyAppFiles).reduce(createPathRecords, {})
    }
  }
});

System.import('angular2/src/core/dom/browser_adapter')
    .then(function(browser_adapter) { browser_adapter.BrowserDomAdapter.makeCurrent(); })
    .then(function() { return Promise.all(resolveTestFiles()); })
    .then(function() { __karma__.start(); }, function(error) { __karma__.error(error.stack || error); });

function createPathRecords(pathsMapping, appPath) {
  // creates local module name mapping to global path with karma's fingerprint in path, e.g.:
  // './accordion/accordion':
  // '/base/temp/accordion/accordion.js?f4523daf879cfb7310ef6242682ccf10b2041b3e'
  var pathParts = appPath.split('/');
  var moduleName = './' + pathParts.slice(Math.max(pathParts.length - 2, 1)).join('/');
  moduleName = moduleName.replace(/\.js$/, '');
  pathsMapping[moduleName] = appPath + '?' + window.__karma__.files[appPath];
  return pathsMapping;
}

function onlyAppFiles(filePath) {
  return /\/base\/temp\/(?!.*\.spec\.js$).*\.js$/.test(filePath);
}

function onlySpecFiles(path) {
  return /\.spec\.js$/.test(path);
}

function resolveTestFiles() {
  return Object.keys(window.__karma__.files)  // All files served by Karma.
      .filter(onlySpecFiles)
      .map(function(moduleName) {
        // loads all spec files via their global module names (e.g.
        // 'base/temp/accordion/accordion.test')
        return System.import(moduleName);
      });
}
