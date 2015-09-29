var gulp = require('gulp');
var gutil = require('gulp-util');
var ts = require('gulp-typescript');
var del = require('del');
var webpack = require('webpack');
var gulpFormat = require('gulp-clang-format');
var clangFormat = require('clang-format');

gulp.task('clean', function (cb) {
  del('dist/', cb);
});

gulp.task('es5', function () {
  var tsProject = ts.createProject('tsconfig.json', {
    module: 'commonjs',
    target: 'es5'
  });

  var tsResult = gulp.src(['typings/tsd.d.ts', 'src/**/*.ts'])
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('dist/cjs'));
});

gulp.task('es6', function () {
  var tsProject = ts.createProject('tsconfig.json');

  var tsResult = gulp.src(['typings/tsd.d.ts', 'src/**/*.ts'])
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('dist/es6'));
});

gulp.task('umd', ['es5', 'es6'], function (cb) {
  webpack({
    entry: './dist/cjs/core.js',
    output: {
      filename: 'dist/global/ng-bootstrap.js',
      libraryTarget: 'umd'
    },
    externals: {
      'angular2/angular2': 'angular2/angular2'
    }
  }, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log("[webpack]", stats.toString());
    cb();
  })
});

gulp.task('check-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("NOTE: this will be promoted to an ERROR in the continuous build");
  });
});

gulp.task('enforce-format', function() {
  return doCheckFormat().on('warning', function(e) {
    console.log("ERROR: You forgot to run clang-format on your change.");
    console.log("See https://github.com/ng-bootstrap/core/blob/master/DEVELOPER.md#clang-format");
    process.exit(1);
  });
});

gulp.task('build', ['clean', 'umd', 'check-format']);
gulp.task('default', ['build']);

//formatting
function doCheckFormat() {
  return gulp.src(['src/**/*.ts'])
    .pipe(gulpFormat.checkFormat('file', clangFormat));
}