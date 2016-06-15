var doc = require('./api-doc');

function getFileNames(directiveName) {
  return [`./src/${directiveName}/${directiveName}.ts`];
}
console.log(JSON.stringify(doc(getFileNames('tabset'))));
