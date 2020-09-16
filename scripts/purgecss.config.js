// See https://purgecss.com/configuration.html for the documentation

const path = require('path');
const srcPath = path.join(__dirname, '..');

function getFullPaths(...files) {
  const fullPaths = [];
  for (file of files) {
    fullPaths.push(path.join(srcPath, file));
  }

  return fullPaths;
}


module.exports = {

  /*
    Give the content to be analysed by the extractor
  */
  content: getFullPaths(
      'demo/src/public/**/*.html', 'demo/src/app/**/*.html', 'demo/src/app/**/*.ts', 'demo/src/app/**/*.ts',
      'src/**/*.html', 'src/**/*.ts'),


  /* Css files to purge */
  css: [path.join(srcPath, 'demo/dist/**/*.css')],


  /* Enable the default extractor if the default one is not enough, or for debugging purpose */
  /*
   defaultExtractor: content => {
     const result = content.match(/[\w-/:]+(?<!:)/g) || [];
     return result;
   },
   */

  /* white list some patterns if needed */
  whitelistPatterns: [/^alert-/],

  variables: true,

  fontFace: true,

  /* Allow to see what classes are rejected (debugging purpose) */
  // rejected: true,

}