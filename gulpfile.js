const gulp = require('gulp');
const ghPages = require('gulp-gh-pages');
const clangFormat = require('clang-format');
const gulpFormat = require('gulp-clang-format');

gulp.task('changelog', function() {
  const conventionalChangelog = require('gulp-conventional-changelog');
  return gulp.src('CHANGELOG.md', {})
      .pipe(conventionalChangelog({preset: 'angular', releaseCount: 1}, {
        // Override release version to avoid `v` prefix for git comparison
        // See https://github.com/conventional-changelog/conventional-changelog-core/issues/10
        currentTag: require('./package.json').version
      }))
      .pipe(gulp.dest('./'));
});

// Formatting

gulp.task('check-format', function() {
  return gulp.src(['gulpfile.js', 'misc/*.ts', 'src/**/*.ts'])
      .pipe(gulpFormat.checkFormat('file', clangFormat))
      .on('warning', function(e) {
        console.log("See https://github.com/ng-bootstrap/ng-bootstrap/blob/master/DEVELOPER.md#clang-format");
        process.exit(1);
      });
});

// Demo

gulp.task('demo-push', function() {
  return gulp.src('demo/dist/**/*')
      .pipe(ghPages({remoteUrl: "https://github.com/ng-bootstrap/ng-bootstrap.github.io.git", branch: "master"}));
});
