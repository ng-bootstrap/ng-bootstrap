var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var ddescribeIit = require('gulp-ddescribe-iit');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');
var del = require('del');
var merge = require('merge2');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var webpack = require('webpack');
var webpackDemoConfig = require('./webpack.demo.js');

var PATHS = {
  src: 'src/**/*.ts',
  specs: 'src/**/*.spec.ts',
  demo: 'demo/**/*.ts',
  demoDist: 'demo/dist/**/*',
  typings: 'typings/index.d.ts',
  demoDocsJson: 'demo/src/docs.json'
};

function webpackCallBack(taskName, gulpDone) {
  return function(err, stats) {
    if (err) throw new gutil.PluginError(taskName, err);
    gutil.log("[" + taskName + "]", stats.toString());
    gulpDone();
  }
}

// Transpiling & Building

var buildProject = ts.createProject('tsconfig.json', {declaration: true});

gulp.task('clean:build', function() { return del('dist/'); });

gulp.task('cjs', function() {
  var tsResult = gulp.src([PATHS.src, PATHS.typings, '!' + PATHS.specs]).pipe(ts(buildProject));

  return merge([tsResult.dts.pipe(gulp.dest('dist/cjs')), tsResult.js.pipe(gulp.dest('dist/cjs'))]);
});

gulp.task('umd', function(cb) {
  function ngExternal(ns) {
    var ng2Ns = 'angular2/' + ns;
    return {root: ['ng', ns], commonjs: ng2Ns, commonjs2: ng2Ns, amd: ng2Ns};
  }

  webpack(
      {
        entry: './dist/cjs/core.js',
        output: {filename: 'dist/global/ng-bootstrap.js', library: 'ngb', libraryTarget: 'umd'},
        externals: {'angular2/core': ngExternal('core'), 'angular2/common': ngExternal('common')}
      },
      webpackCallBack('webpack', cb));
});

// Testing

var testProject = ts.createProject('tsconfig.json');

function startKarmaServer(isTddMode, done) {
  var karmaServer = require('karma').Server;
  var travis = process.env.TRAVIS;

  var config = {configFile: __dirname + '/karma.conf.js', singleRun: !isTddMode, autoWatch: isTddMode};

  if (travis) {
    config['reporters'] = ['dots'];
    config['browsers'] = ['Firefox'];
  }

  new karmaServer(config, done).start();
}

gulp.task('clean:tests', function() { return del('temp/'); });

gulp.task('build:tests', function() {
  var tsResult = gulp.src([PATHS.src, PATHS.typings]).pipe(sourcemaps.init()).pipe(ts(testProject));

  return tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('temp'));
});

gulp.task('clean:build-tests', function(done) { runSequence('clean:tests', 'build:tests', done); });

gulp.task(
    'ddescribe-iit', function() { return gulp.src(PATHS.specs).pipe(ddescribeIit({allowDisabledTests: false})); });

gulp.task('test', ['clean:build-tests'], function(done) { startKarmaServer(false, done); });

gulp.task('tdd', ['clean:build-tests'], function(done) {
  startKarmaServer(true, function(err) {
    done(err);
    process.exit(1);
  });

  gulp.watch(PATHS.src, ['build:tests']);
});


// Formatting

gulp.task('lint', function() {
  return gulp.src(PATHS.src).pipe(tslint({configuration: require('./tslint.json')})).pipe(tslint.report('prose', {
    summarizeFailureOutput: true
  }));
});

gulp.task('check-format', function() {
  return doCheckFormat().on(
      'warning', function(e) { console.log("NOTE: this will be promoted to an ERROR in the continuous build"); });
});

gulp.task('enforce-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("ERROR: You forgot to run clang-format on your change.");
    console.log("See https://github.com/ng-bootstrap/core/blob/master/DEVELOPER.md#clang-format");
    process.exit(1);
  });
});

function doCheckFormat() {
  return gulp.src(['gulpfile.js', 'karma-test-shim.js', 'misc/api-doc.js', 'misc/api-doc.spec.js', PATHS.src])
      .pipe(gulpFormat.checkFormat('file', clangFormat));
}

// Demo

gulp.task('generate-docs', function() {
  var getApiDocs = require('./misc/get-doc');
  var jsonfile = require('jsonfile');

  var docs = getApiDocs();
  jsonfile.writeFileSync(PATHS.demoDocsJson, docs);
});

gulp.task('clean:demo', function() { return del('demo/dist'); });

gulp.task('clean:demo-cache', function() { return del('.publish/'); });

gulp.task(
    'demo-server', ['generate-docs'],
    shell.task(['webpack-dev-server --config webpack.demo.js --hot --inline --progress']));

gulp.task(
    'build:demo', ['clean:demo', 'generate-docs'],
    shell.task(['MODE=build webpack --config webpack.demo.js --progress --profile --bail']));

gulp.task('demo-push', function() { return gulp.src(PATHS.demoDist).pipe(ghPages()); });

// Public Tasks
gulp.task('clean', ['clean:build', 'clean:tests', 'clean:demo', 'clean:demo-cache']);

gulp.task('build', function(done) {
  runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', 'clean:build', 'cjs', 'umd', done);
});

gulp.task(
    'deploy-demo', function(done) { runSequence('clean:demo', 'build:demo', 'demo-push', 'clean:demo-cache', done); });

gulp.task('default', function(done) { runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', done); });
