// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// // Cancel Karma's synchronous start,
// // we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

System.config({baseURL: '/base'});

System.config({
  paths: {
    // paths serve as alias
    'npm:': 'node_modules/'
  },
  // map tells the System loader where to look for things
  map: {
    // our temp folder
    temp: 'temp',
    // IE9, IE10 and IE11 polyfills
    'core-js/es6/symbol': 'npm:core-js/es6/symbol.js' 'core-js/es6/object':
        'npm:core-js/es6/object.js' 'core-js/es6/function': 'npm:core-js/es6/function.js' 'core-js/es6/parse-int':
            'npm:core-js/es6/parse-int.js' 'core-js/es6/parse-float':
                'npm:core-js/es6/parse-float.js' 'core-js/es6/number': 'npm:core-js/es6/number.js' 'core-js/es6/math':
                    'npm:core-js/es6/math.js' 'core-js/es6/string': 'npm:core-js/es6/string.js' 'core-js/es6/date':
                        'npm:core-js/es6/date.js' 'core-js/es6/array': 'npm:core-js/es6/array.js' 'core-js/es6/regexp':
                            'npm:core-js/es6/regexp.js' 'core-js/es6/map': 'npm:core-js/es6/map.js' 'core-js/es6/set':
                                'npm:core-js/es6/set.js'
    // polyfills
    'core-js/es6/reflect': 'npm:core-js/es6/reflect.js',
    'core-js/es7/reflect': 'npm:core-js/es7/reflect.js',
    'zone.js/dist/zone': 'npm:zone.js/dist/zone.js',
    // override polyfills for tests
    'zone.js/dist/long-stack-trace-zone': 'npm:zone.js/dist/long-stack-trace-zone.js',
    'zone.js/dist/proxy': 'npm:zone.js/dist/proxy.js',
    'zone.js/dist/sync-test': 'npm:zone.js/dist/sync-test.js',
    'zone.js/dist/jasmine-patch': 'npm:zone.js/dist/jasmine-patch.js',
    'zone.js/dist/async-test': 'npm:zone.js/dist/async-test.js',
    'zone.js/dist/fake-async-test': 'npm:zone.js/dist/fake-async-test.js',

    // angular bundles
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic':
        'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',

    // angular testing umd bundles
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing':
        'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
    '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',

    // other libraries
    'rxjs': 'npm:rxjs'
  },
  packages: {temp: {main: 'core.js', defaultExtension: 'js'}, rxjs: {defaultExtension: 'js'}}
});

System.import('@angular/core/testing')
    .then(function(coreTesting) {
      return System.import('@angular/platform-browser-dynamic/testing').then(function(browserTesting) {
        coreTesting.getTestBed().initTestEnvironment(
            browserTesting.BrowserDynamicTestingModule, browserTesting.platformBrowserDynamicTesting());
      });
    })
    .then(function() { return Promise.all(customMatchers()); })
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

function customMatchers() {
  return System.import('/base/temp/test/matchers.js');
}

function onlyBuiltFiles(filePath) {
  return /^\/base\/temp\//.test(filePath);
}

function onlySpecFiles(path) {
  return /\.spec\.js$/.test(path);
}

function resolveTestFiles() {
  return Object
      .keys(window.__karma__.files)  // All files served by Karma.
      .filter(onlyBuiltFiles)
      .filter(onlySpecFiles)
      .map(function(moduleName) {
        // loads all spec files via their global module names (e.g.
        // 'base/temp/accordion/accordion.test')
        return System.import(moduleName);
      });
}
