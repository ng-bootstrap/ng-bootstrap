var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function genDemoComponent(component, demo) {
  const directivesToImport = `NGB_${component.toUpperCase()}_DIRECTIVES`;

  return `import {Component} from '@angular/core';
import {${directivesToImport}} from '@ng-bootstrap/${component}';

@Component({
  selector: 'ngbd-${component}-${demo}',
  template: require('./${component}-${demo}.html'),
  directives: [${directivesToImport}]
})
export class Ngbd${capitalize(component)}${capitalize(demo)} {
}
`;
}

function genDemo(component, demo) {
  const demoFolder = `./demo/src/app/components/${component}/demos/${demo}`;
  const componentFile = `${demoFolder}/${component}-${demo}`;
  const codeFile = `${componentFile}.ts`;
  const markupFile = `${componentFile}.html`;

  mkdirp.sync(demoFolder);

  if (!fs.exists(codeFile)) {
    fs.writeFileSync(codeFile, genDemoComponent(component, demo), {flag: 'w'});
  }

  if (!fs.exists(markupFile)) {
    fs.writeFileSync(markupFile, ' ', {flag: 'w'});
  }
}

function genDemosIndex(component) {
  const base = `demo/src/app/components/${component}/demos`;
  const path = `${base}/*/`;
  const demoNames = glob.sync(path, {})
                        .map((dir) => {
                          const dirNoEndingSlash = dir.substr(0, dir.length - 1);
                          return dirNoEndingSlash.substr(dirNoEndingSlash.lastIndexOf('/') + 1);
                        })
                        .sort();

  const demoImports =
      demoNames
          .map((demo) => {
            return `import {Ngbd${capitalize(component)}${capitalize(demo)}} from './${demo}/${component}-${demo}';`;
          })
          .join('\n');

  const demoDirectives = demoNames.map((demo) => { return `Ngbd${capitalize(component)}${capitalize(demo)}`; });

  const demoSnippets = demoNames.map((demo) => {
    return `  "${demo}": {
    "code": require('!!prismjs?lang=typescript!./${demo}/${component}-${demo}'), 
    "markup": require('!!prismjs?lang=markup!./${demo}/${component}-${demo}.html')}`;
  });

  return `${demoImports}
  
export const DEMO_DIRECTIVES = [${demoDirectives.join(', ')}];

export const DEMO_SNIPPETS = {
${demoSnippets.join(',\n')}
};
`;
}

function genIndex(componentName) {
  const componentDemosFolder = `./demo/src/app/components/${componentName}/demos`;
  fs.writeFileSync(`${componentDemosFolder}/index.ts`, genDemosIndex(componentName), {flag: 'w'});
}

const args = process.argv;
const componentName = args[2];
const demoNames = args[3];

if (args.length === 4) {
  demoNames.split(',').forEach((demo) => { genDemo(componentName, demo); });
  genIndex(componentName);
} else if (args.length === 3) {
  genIndex(componentName);
} else {
  console.log('Usage: node misc/demo-gen.js [component] [demo]\n');
}
