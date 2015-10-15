var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var gulpFormat = require('gulp-clang-format');
var clangFormat = require('clang-format');

gulp.task('umd', function(cb) {
  webpack(
      {
        entry: './dist/cjs/core.js',
        output: {filename: 'dist/global/ng-bootstrap.js', library: 'ngb', libraryTarget: 'umd'},
        externals: {
          'angular2/angular2':
              {root: 'ng', commonjs: 'angular2/angular2', commonjs2: 'angular2/angular2', amd: 'angular2/angular2'}
        }
      },
      function(err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log("[webpack]", stats.toString());
        cb();
      })
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

gulp.task('build', ['umd', 'check-format']);
gulp.task('default', ['build']);

// formatting
function doCheckFormat() {
  return gulp.src(['gulpfile.js', 'src/**/*.ts']).pipe(gulpFormat.checkFormat('file', clangFormat));
}
