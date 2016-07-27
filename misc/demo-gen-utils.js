var glob = require('glob');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDemoComponentNames() {
  const path = 'demo/src/app/components/*/';

  return glob.sync(path, {})
      .map((dir) => {
      const dirNoEndingSlash = dir.substr(0, dir.length - 1);
  return dirNoEndingSlash.substr(dirNoEndingSlash.lastIndexOf('/') + 1);
})
.sort();
}

function getDemoNames(componentName) {
  const base = `demo/src/app/components/${componentName}/demos`;
  const path = `${base}/*/`;

  return glob.sync(path, {})
      .map((dir) => {
        const dirNoEndingSlash = dir.substr(0, dir.length - 1);
        return dirNoEndingSlash.substr(dirNoEndingSlash.lastIndexOf('/') + 1);
      })
      .sort();
}

module.exports = {
  capitalize: capitalize,
  getDemoComponentNames: getDemoComponentNames,
  getDemoNames: getDemoNames
};
