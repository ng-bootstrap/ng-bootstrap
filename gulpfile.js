var gulp = require('gulp');
var gutil = require('gulp-util');
var ts = require('gulp-typescript');
var del = require('del');
var webpack = require('webpack');

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

gulp.task('build', ['clean', 'umd']);
gulp.task('default', ['build']);