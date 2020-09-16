const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

const scrPath = path.join(__dirname, '..');
const config = require('./purgecss.config');

const formatNumber = Intl.NumberFormat('en', {maximumFractionDigits: 1}).format;

new PurgeCSS().purge(config).then(function(results) {
  for(const {file, css, rejected} of results) {
    const originalSize = formatNumber(fs.statSync(file)['size'] / 1000) + ' kB';
    fs.writeFileSync(file, css);
    const newSize = formatNumber(fs.statSync(file)['size'] / 1000) + ' kB';
    console.log(`Purge css for file ${file.replace(scrPath, '')}, old size : ${originalSize}, new size : ${newSize}`);
    if (rejected && rejected.length) {
      console.log('Rejected classes', rejected)
    }
  }
});
