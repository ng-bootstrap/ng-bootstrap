const gulp = require('gulp');
const clangFormat = require('clang-format');
const gulpFormat = require('gulp-clang-format');

gulp.task('check-format', function() {
  return gulp.src(['gulpfile.js', 'misc/*.ts', 'src/**/*.ts', 'e2e-app/**/*.ts'])
      .pipe(gulpFormat.checkFormat('file', clangFormat))
      .on('warning', function(e) {
        console.log("See https://github.com/ng-bootstrap/ng-bootstrap/blob/master/DEVELOPER.md#clang-format");
        process.exit(1);
      });
});
