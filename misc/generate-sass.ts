import * as glob from 'glob';
import * as fs from 'fs-extra';
import * as sass from 'node-sass';
import * as path from 'path';


const processSass = (file) => {
  const cssCode = sass.renderSync({
    file,
    importer: (url) => {
      if (url[0] === '~') {
        url = path.resolve('node_modules', url.substr(1));
      }
      return {file: url};
    }
  });
  return cssCode;
};

/*
  Copy file one by one to avoid empty folders
*/
const sassFiles = glob.sync('src/**/*.scss');
sassFiles.forEach((file) => {

  const dstScssFile = file.replace('src/', 'dist/scss/');
  const dstScssDir = path.dirname(dstScssFile);
  const dstCssFile = file.replace('src/', 'dist/css/').replace('.scss', '.css');
  const dstCssDir = path.dirname(dstCssFile);


  fs.ensureDirSync(dstScssDir);
  fs.ensureDirSync(dstCssDir);

  console.log('Copy sass file', file, dstScssFile);
  fs.copySync(file, dstScssFile);

  // Generate Css for each widget too
  console.log('Convertion sass file', file, dstCssFile);
  const css = processSass(file).css;
  fs.writeFileSync(dstCssFile, css);
});
