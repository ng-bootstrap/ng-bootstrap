var gulp = require('gulp');
var ts = require('gulp-typescript');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var ddescribeIit = require('gulp-ddescribe-iit');
var shell = require('gulp-shell');
var ghPages = require('gulp-gh-pages');
var gulpFile = require('gulp-file');
var del = require('del');
var merge = require('merge2');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');
var runSequence = require('run-sequence');
var tslint = require('gulp-tslint');
var webpack = require('webpack');

var PATHS = {
  src: 'src/**/*.ts',
  srcIndex: 'src/index.ts',
  specs: 'src/**/*.spec.ts',
  testHelpers: 'src/util/matchers.ts',
  demo: 'demo/**/*.ts',
  demoDist: 'demo/dist/**/*',
  typings: 'typings/index.d.ts',
  jasmineTypings: 'typings/globals/jasmine/index.d.ts',
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

var cjsProject = ts.createProject('tsconfig.json', {declaration: true});
var esmProject = ts.createProject('tsconfig-es2015.json');

gulp.task('clean:build', function() { return del('dist/'); });

gulp.task('cjs', function() {
  var tsResult = gulp.src([PATHS.src, PATHS.typings, '!' + PATHS.specs, '!' + PATHS.testHelpers])
                     .pipe(sourcemaps.init())
                     .pipe(ts(cjsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/')),
    tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('dist/'), tsResult.js.pipe(gulp.dest('dist/')))
  ]);
});

gulp.task('esm', function() {
  var tsResult = gulp.src([PATHS.src, PATHS.jasmineTypings, '!' + PATHS.specs, '!' + PATHS.testHelpers])
                     .pipe(sourcemaps.init())
                     .pipe(ts(esmProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/esm')),
    tsResult.js.pipe(sourcemaps.write('.')).pipe(gulp.dest('dist/esm'), tsResult.js.pipe(gulp.dest('dist/esm')))
  ]);
});

gulp.task('umd', function(cb) {
  function ngExternal(ns) {
    var ng2Ns = '@angular/' + ns;
    return {root: ['ng', ns], commonjs: ng2Ns, commonjs2: ng2Ns, amd: ng2Ns};
  }

  webpack(
      {
        entry: './dist/index.js',
        output: {filename: 'dist/bundles/ng-bootstrap.js', library: 'ngb', libraryTarget: 'umd'},
        devtool: 'source-map',
        externals: {'@angular/core': ngExternal('core'), '@angular/common': ngExternal('common')}
      },
      webpackCallBack('webpack', cb));
});

gulp.task('npm', function() {
  var pkgJson = require('./package.json');
  var targetPkgJson = {};
  var fieldsToCopy = ['version', 'description', 'keywords', 'author', 'repository', 'license', 'bugs', 'homepage'];

  targetPkgJson['name'] = '@ng-bootstrap/ng-bootstrap';

  fieldsToCopy.forEach(function(field) { targetPkgJson[field] = pkgJson[field]; });

  targetPkgJson['main'] = 'index.js';
  targetPkgJson['jsnext:main'] = 'esm/index.js';

  targetPkgJson.peerDependencies = {};
  Object.keys(pkgJson.dependencies).forEach(function(dependency) {
    targetPkgJson.peerDependencies[dependency] = '^' + pkgJson.dependencies[dependency];
  });

  return gulp.src('README.md')
      .pipe(gulpFile('package.json', JSON.stringify(targetPkgJson, null, 2)))
      .pipe(gulp.dest('dist'));
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
  var jsonfile = require('jsonfile');

  var docs = getApiDocs();
  jsonfile.writeFileSync(PATHS.demoDocsJson, docs);
});

gulp.task('clean:demo', function() { return del('demo/dist'); });

gulp.task('clean:demo-cache', function() { return del('.publish/'); });

gulp.task(
    'demo-server', ['generate-docs'],
    shell.task(['webpack-dev-server --port 9090 --config webpack.demo.js --hot --inline --progress']));

gulp.task(
    'build:demo', ['clean:demo', 'generate-docs'],
    shell.task(['MODE=build webpack --config webpack.demo.js --progress --profile --bail']));

gulp.task('demo-push', function() {
  return gulp.src(PATHS.demoDist)
      .pipe(ghPages({remoteUrl: "https://github.com/ng-bootstrap/ng-bootstrap.github.io.git", branch: "master"}));
});

// Public Tasks
gulp.task('clean', ['clean:build', 'clean:tests', 'clean:demo', 'clean:demo-cache']);

gulp.task('build', function(done) {
  runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', 'clean:build', 'cjs', 'esm', 'umd', 'npm', done);
});

gulp.task(
    'deploy-demo', function(done) { runSequence('clean:demo', 'build:demo', 'demo-push', 'clean:demo-cache', done); });

gulp.task('default', function(done) { runSequence('lint', 'enforce-format', 'ddescribe-iit', 'test', done); });
