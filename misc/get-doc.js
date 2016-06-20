const fs = require('fs');
const doc = require('./api-doc');
const excluded = new Set([
  'util'
]);

function isDirectory(path) {
  return fs.lstatSync(path).isDirectory();
}

function getFileNames(directiveName) {
  return [`./src/${directiveName}/${directiveName}.ts`];
}

function fileExists(file) {
  let result = false;
  try {
    fs.accessSync(file);
    result = true;
  }
  catch (e) {
    console.error(`the specified file does not exist: ${file}`)
  }

  return result;
}

function getComponentMap() {
  const componentMap = new Map();
  const items = fs.readdirSync('./src');
  items.forEach(component => {
    if (!excluded.has(component) && isDirectory(`./src/${component}`)) {
      const names = getFileNames(component);
      if (names.every(name => fileExists(name))) {
        componentMap.set(component, doc(names));
      }
    }
  });

  return componentMap;
}

module.exports = getComponentMap;
