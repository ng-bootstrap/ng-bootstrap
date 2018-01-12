var asyncDone = require('async-done');
var gulp = require('gulp');
var gutil = require('gulp-util');
var ddescribeIit = require('gulp-ddescribe-iit');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');
var gulpFile = require('gulp-file');
var del = require('del');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var webpack = require('webpack');
var typescript = require('typescript');
var exec = require('child_process').exec;
var path = require('path');
var os = require('os');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

var PATHS = {
  src: 'src/**/*.ts',
  srcIndex: 'src/index.ts',
  specs: 'src/**/*.spec.ts',
  testHelpers: 'src/test/**/*.ts',
  demo: 'demo/**/*.ts',
  demoDist: 'demo/dist/**/*',
  typings: 'typings/index.d.ts',
  jasmineTypings: 'typings/globals/jasmine/index.d.ts',
  demoApiDocs: 'demo/src',
  coverageJson: 'coverage/json/coverage-final.json'
};

const docsConfig = Object.assign({port: 9090}, getLocalConfig());

function platformPath(path) {
  return /^win/.test(os.platform()) ? `${path}.cmd` : path;
}

function webpackCallBack(taskName, gulpDone) {
  return function(err, stats) {
    if (err) throw new gutil.PluginError(taskName, err);
    gutil.log(`[${taskName}]`, stats.toString());
    gulpDone();
  }
}

// Transpiling & Building

gulp.task('clean:build', function() { return del('dist/'); });

gulp.task('ngc', function(cb) {
  var executable = path.join(__dirname, platformPath('/node_modules/.bin/ngc'));
  exec(`${executable} -p ./tsconfig-es2015.json`, (e) => {
    if (e) console.log(e);
    del('./dist/waste');
    cb();
  }).stdout.on('data', function(data) { console.log(data); });
});

gulp.task('umd', function(cb) {
  function ngExternal(ns) {
    var ng2Ns = `@angular/${ns}`;
    return {root: ['ng', ns], commonjs: ng2Ns, commonjs2: ng2Ns, amd: ng2Ns};
  }

  function rxjsExternal(context, request, cb) {
    if (/^rxjs\/add\/observable\//.test(request)) {
      return cb(null, {root: ['Rx', 'Observable'], commonjs: request, commonjs2: request, amd: request});
    } else if (/^rxjs\/add\/operator\//.test(request)) {
      return cb(null, {root: ['Rx', 'Observable', 'prototype'], commonjs: request, commonjs2: request, amd: request});
    } else if (/^rxjs\//.test(request)) {
      return cb(null, {root: ['Rx'], commonjs: request, commonjs2: request, amd: request});
    }
    cb();
  }

  webpack(
      {
        entry: './temp/index.js',
        output: {filename: 'dist/bundles/ng-bootstrap.js', library: 'ngb', libraryTarget: 'umd'},
        devtool: 'source-map',
        externals: [
          {
            '@angular/core': ngExternal('core'),
            '@angular/common': ngExternal('common'),
            '@angular/forms': ngExternal('forms')
          },
          rxjsExternal
        ]
      },
      webpackCallBack('webpack', cb));
});

gulp.task('npm', function() {
  var pkgJson = require('./package.json');
  var targetPkgJson = {};
  var fieldsToCopy = ['version', 'description', 'keywords', 'author', 'repository', 'license', 'bugs', 'homepage'];

  targetPkgJson['name'] = '@ng-bootstrap/ng-bootstrap';

  fieldsToCopy.forEach(function(field) { targetPkgJson[field] = pkgJson[field]; });

  targetPkgJson['main'] = 'bundles/ng-bootstrap.js';
  targetPkgJson['module'] = 'index.js';
  targetPkgJson['typings'] = 'index.d.ts';

  targetPkgJson.peerDependencies = {};
  Object.keys(pkgJson.dependencies).forEach(function(dependency) {
    targetPkgJson.peerDependencies[dependency] = `^${pkgJson.dependencies[dependency]}`;
  });

  return gulp.src(['README.md', 'LICENSE'])
      .pipe(gulpFile('package.json', JSON.stringify(targetPkgJson, null, 2)))
      .pipe(gulp.dest('dist'));
});

gulp.task('changelog', function() {
  var conventionalChangelog = require('gulp-conventional-changelog');
  return gulp.src('CHANGELOG.md', {})
      .pipe(conventionalChangelog({preset: 'angular', releaseCount: 1}, {
        // Override release version to avoid `v` prefix for git comparison
        // See https://github.com/conventional-changelog/conventional-changelog-core/issues/10
        currentTag: require('./package.json').version
      }))
      .pipe(gulp.dest('./'));
});

// Testing

function startKarmaServer(isTddMode, isSaucelabs, done) {
  var karmaServer = require('karma').Server;
  var travis = process.env.TRAVIS;

  var config = {configFile: `${__dirname}/karma.conf.js`, singleRun: !isTddMode, autoWatch: isTddMode};

  if (travis) {
    config['reporters'] = ['dots'];
    config['browsers'] = ['Firefox'];
  }

  if (isSaucelabs) {
    config['reporters'] = ['dots', 'saucelabs'];
    config['browsers'] =
        ['SL_CHROME', 'SL_FIREFOX', 'SL_IE10', 'SL_IE11', 'SL_EDGE14', 'SL_EDGE15', 'SL_SAFARI10', 'SL_SAFARI11'];

    if (process.env.TRAVIS) {
      var buildId = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;
      config['sauceLabs'] = {build: buildId, tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER};
      process.env.SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY.split('').reverse().join('');
    }
  }

  new karmaServer(config, done).start();
}

gulp.task('clean:tests', function() { return del(['temp/', 'coverage/']); });

gulp.task('build:tests', ['clean:tests'], (cb) => {
  exec(path.join(__dirname, platformPath('/node_modules/.bin/tsc')), (e) => {
    if (e) console.log(e);
    cb();
  }).stdout.on('data', function(data) { console.log(data); });
});

gulp.task(
    'ddescribe-iit', function() { return gulp.src(PATHS.specs).pipe(ddescribeIit({allowDisabledTests: false})); });

gulp.task('test', ['build:tests'], function(done) {
  startKarmaServer(false, false, () => {
    asyncDone(
        () => { return gulp.src(PATHS.coverageJson).pipe(remapIstanbul({reports: {'html': 'coverage/html'}})); }, done);
  });
});

gulp.task('remap-coverage', function() {
  return gulp.src(PATHS.coverageJson).pipe(remapIstanbul({reports: {'html': 'coverage/html'}}));
});

gulp.task('tdd', ['clean:tests'], (cb) => {
  var executable = path.join(__dirname, platformPath('/node_modules/.bin/tsc'));
  var startedKarma = false;

  exec(`${executable} -w`, (e) => {
    cb(e && e.signal !== 'SIGINT' ? e : undefined);
  }).stdout.on('data', function(data) {

    console.log(data);

    // starting karma in tdd as soon as 'tsc -w' finishes first compilation
    if (!startedKarma) {
      startedKarma = true;
      startKarmaServer(true, false, function(err) { process.exit(err ? 1 : 0); });
    }
  });
});

gulp.task('saucelabs', ['build:tests'], function(done) {
  startKarmaServer(false, true, function(err) {
    done(err);
    process.exit(err ? 1 : 0);
  });
});

// Formatting

gulp.task('lint', function() {
  return gulp.src([PATHS.src, PATHS.demo, '!demo/src/api-docs.ts'])
      .pipe(tslint({configuration: require('./tslint.json'), formatter: 'prose'}))
      .pipe(tslint.report({summarizeFailureOutput: true}));
});

gulp.task('check-format', function() {
  return doCheckFormat().on(
      'warning', function(e) { console.log("NOTE: this will be promoted to an ERROR in the continuous build"); });
});

gulp.task('enforce-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("ERROR: You forgot to run clang-format on your change.");
    console.log("See https://github.com/ng-bootstrap/ng-bootstrap/blob/master/DEVELOPER.md#clang-format");
    process.exit(1);
  });
});

function doCheckFormat() {
  return gulp
      .src([
        'gulpfile.js', 'karma-test-shim.js', 'misc/api-doc.js', 'misc/api-doc.spec.js', 'misc/demo-gen.js', PATHS.src
      ])
      .pipe(gulpFormat.checkFormat('file', clangFormat));
}

// Demo

gulp.task('generate-docs', function() {
  var getApiDocs = require('./misc/get-doc');
  var docs = `const API_DOCS = ${JSON.stringify(getApiDocs(), null, 2)};\n\nexport default API_DOCS;`;

  return gulpFile('api-docs.ts', docs, {src: true}).pipe(gulp.dest(PATHS.demoApiDocs));
});

gulp.task('generate-plunks', function() {
  var getPlunker = require('./misc/plunk-gen');
  var demoGenUtils = require('./misc/demo-gen-utils');
  var plunks = [];

  demoGenUtils.getDemoComponentNames().forEach(function(componentName) {
    plunks = plunks.concat(demoGenUtils.getDemoNames(componentName).reduce(function(soFar, demoName) {
      soFar.push({name: `${componentName}/demos/${demoName}/plnkr.html`, source: getPlunker(componentName, demoName)});
      return soFar;
    }, []));
  });

  return gulpFile(plunks, {src: true}).pipe(gulp.dest('demo/src/public/app/components'));
});

gulp.task('generate-stackblitzes', function() {
  var getStackblitz = require('./misc/stackblitz-gen');
  var demoGenUtils = require('./misc/demo-gen-utils');
  var stackblitzes = [];

  demoGenUtils.getDemoComponentNames().forEach(function(componentName) {
    stackblitzes = stackblitzes.concat(demoGenUtils.getDemoNames(componentName).reduce(function(soFar, demoName) {
      soFar.push(
          {name: `${componentName}/demos/${demoName}/stackblitz.html`, source: getStackblitz(componentName, demoName)});
      return soFar;
    }, []));
  });

  return gulpFile(stackblitzes, {src: true}).pipe(gulp.dest('demo/src/public/app/components'));
});

gulp.task('clean:demo', function() { return del('demo/dist'); });

gulp.task('clean:demo-cache', function() { return del('.publish/'); });

gulp.task(
    'demo-server', ['generate-docs', 'generate-plunks', 'generate-stackblitzes'],
    shell.task([`webpack-dev-server --port ${docsConfig.port} --config webpack.demo.js --inline --progress`]));

gulp.task(
    'build:demo', ['clean:demo', 'generate-docs', 'generate-plunks', 'generate-stackblitzes'],
    shell.task(['webpack --config webpack.demo.js --progress --profile --bail'], {env: {MODE: 'build'}}));

gulp.task(
    'demo-server:aot', ['generate-docs', 'generate-plunks', 'generate-stackblitzes'],
    shell.task(
        [`webpack-dev-server --port ${docsConfig.port} --config webpack.demo.js --inline --progress`],
        {env: {MODE: 'build'}}));

gulp.task('demo-push', function() {
  return gulp.src(PATHS.demoDist)
      .pipe(ghPages({remoteUrl: "https://github.com/ng-bootstrap/ng-bootstrap.github.io.git", branch: "master"}));
});

// Public Tasks
gulp.task('clean', ['clean:build', 'clean:tests', 'clean:demo', 'clean:demo-cache']);

gulp.task('build', function(done) {
  runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', 'clean:build', 'ngc', 'umd', 'npm', done);
});

gulp.task(
    'deploy-demo', function(done) { runSequence('clean:demo', 'build:demo', 'demo-push', 'clean:demo-cache', done); });

gulp.task('default', function(done) { runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', done); });

gulp.task('ci', function(done) { runSequence('default', 'build:demo', done); });

function getLocalConfig() {
  try {
    require.resolve('./local.docs.json');
  } catch (e) {
    return {};
  }

  return require('./local.docs.json');
}
