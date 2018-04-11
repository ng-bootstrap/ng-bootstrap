var gulp = require('gulp');
var ghPages = require('gulp-gh-pages');
var gulpFile = require('gulp-file');
var clangFormat = require('clang-format');
var gulpFormat = require('gulp-clang-format');

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

// Formatting

gulp.task('check-format', function() {
  return gulp
      .src([
        'gulpfile.js', 'karma-test-shim.js', 'misc/api-doc.js', 'misc/api-doc.spec.js', 'misc/demo-gen.js',
        'src/**/*.ts'
      ])
      .pipe(gulpFormat.checkFormat('file', clangFormat))
      .on('warning', function(e) {
        console.log("See https://github.com/ng-bootstrap/ng-bootstrap/blob/master/DEVELOPER.md#clang-format");
        process.exit(1);
      });
});

// Demo

gulp.task('generate-docs', function() {
  var getApiDocs = require('./misc/get-doc');
  var docs = `const API_DOCS = ${JSON.stringify(getApiDocs(), null, 2)};\n\nexport default API_DOCS;`;

  return gulpFile('api-docs.ts', docs, {src: true}).pipe(gulp.dest('demo/src'));
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

gulp.task('demo-generate-static', ['generate-docs', 'generate-plunks', 'generate-stackblitzes']);

gulp.task('copy-license', function() { return gulp.src(['LICENSE', 'README.md']).pipe(gulp.dest('src')); });

gulp.task('demo-push', function() {
  return gulp.src('demo/dist/**/*')
      .pipe(ghPages({remoteUrl: "https://github.com/ng-bootstrap/ng-bootstrap.github.io.git", branch: "master"}));
});
