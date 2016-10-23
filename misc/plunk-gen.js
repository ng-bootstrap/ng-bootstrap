const fs = require('fs');
const he = require('he');
const capitalize = require('./demo-gen-utils').capitalize;

const plnkrUrl = 'http://plnkr.co/edit/?p=preview';

const contentMainTs = fs.readFileSync('misc/plunker-builder-templates/main.ts').toString();
const packageJson = JSON.parse(fs.readFileSync('package.json'));
const versions = getVersions();

const ENTRY_CMPTS = {
  modal: ['component']
};

function generateAppTsContent(componentName, demoName) {
  const demoClassName = `Ngbd${capitalize(componentName)}${capitalize(demoName)}`;
  const demoImport = `./${componentName}-${demoName}`;
  const demoSelector = `ngbd-${componentName}-${demoName}`;
  const needsEntryCmpt = ENTRY_CMPTS.hasOwnProperty(componentName) && ENTRY_CMPTS[componentName].indexOf(demoName) > -1;
  const entryCmptClass =  needsEntryCmpt ? `Ngbd${capitalize(componentName)}Content` : null;
  const demoImports = needsEntryCmpt ? `${demoClassName}, ${entryCmptClass}` : demoClassName;

  return `
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ${demoImports} } from '${demoImport}';

@Component({
  selector: 'my-app',
  template: \`
    <div class="container-fluid">
    
    <hr>
    <p>
      This is a demo plnkr forked from the <strong>ng-bootstrap</strong> project: Angular 2 powered Bootstrap.
      Visit <a href="https://ng-bootstrap.github.io/" target="_blank">https://ng-bootstrap.github.io</a> for more widgets and demos.
    </p>
    <hr>${componentName === 'modal' ? '\n\n      <template ngbModalContainer></template>\n' : ''}

    <${demoSelector}></${demoSelector}>
  </div>
  \`
})
export class App {
}   

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, JsonpModule, NgbModule.forRoot()], 
  declarations: [App, ${demoImports}]${needsEntryCmpt ? `,\n  entryComponents: [${entryCmptClass}],` : ''}
  bootstrap: [App]
}) 
export class AppModule {}
`;
}

function generateTags(tags) {
  return tags.map((tag, idx) => {
    return `    <input type="hidden" name="tags[${idx}]" value="${tag}">`;
  }).join('\n');
}

function generatePlnkrContent(componentName, demoName) {
  const fileName = `${componentName}-${demoName}`;
  const basePath = `demo/src/app/components/${componentName}/demos/${demoName}/${fileName}`;

  const codeContent = fs.readFileSync(`${basePath}.ts`).toString();
  const markupContent = fs.readFileSync(`${basePath}.html`).toString();
  const demoTplPath = `${fileName}.html`;


  return `<!DOCTYPE html>
<html lang="en">
<body>
  <form id="mainForm" method="post" action="${plnkrUrl}">
    <input type="hidden" name="description" value="Example usage of the ${componentName} widget from https://ng-bootstrap.github.io">
${generateTags(['Angular', 'Bootstrap', 'ng-bootstrap', capitalize(componentName)])}  
    <input type="hidden" name="files[index.html]" value="${he.encode(generateIndexHtml())}">
    <input type="hidden" name="files[config.js]" value="${he.encode(generateConfigJs())}">
    <input type="hidden" name="files[src/main.ts]" value="${he.encode(contentMainTs)}">
    <input type="hidden" name="files[src/app.ts]" value="${he.encode(generateAppTsContent(componentName, demoName))}">
    <input type="hidden" name="files[src/${fileName}.ts]" value="${he.encode(codeContent.replace(`./${demoTplPath}`, `src/${demoTplPath}`))}">
    <input type="hidden" name="files[src/${fileName}.html]" value="${he.encode(markupContent)}">
  </form>
  <script>document.getElementById("mainForm").submit();</script>
</body>
</html>`;
}

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html>

  <head>
  <base href="." />
    <title>ng-bootstrap demo</title>
    <link rel="stylesheet" href="http://v4-alpha.getbootstrap.com/dist/css/bootstrap.min.css" />
    <script src="https://unpkg.com/zone.js@${versions.zoneJs}/dist/zone.js"></script>
    <script src="https://unpkg.com/zone.js@${versions.zoneJs}/dist/long-stack-trace-zone.js"></script>
    <script src="https://unpkg.com/reflect-metadata@${versions.reflectMetadata}/Reflect.js"></script>
    <script src="https://unpkg.com/systemjs@${versions.systemjs}/dist/system.js"></script>
    <script src="config.js"></script>
    <script>
    System.import('app').catch(console.error.bind(console));
</script>
  </head>

  <body>
  <my-app>loading...</my-app>
  </body>

</html>`;
}

function generateConfigJs() {
  return `System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //typescript compiler options
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  map: {

    'app': './src',

    '@angular/core': 'npm:@angular/core@${versions.angular}/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common@${versions.angular}/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler@${versions.angular}/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser@${versions.angular}/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@${versions.angular}/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http@${versions.angular}/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router@${versions.angularRouter}/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms@${versions.angular}/bundles/forms.umd.js',

    '@angular/core/testing': 'npm:@angular/core@${versions.angular}/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common@${versions.angular}/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler@${versions.angular}/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser@${versions.angular}/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic@${versions.angular}/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http@${versions.angular}/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router@${versions.angularRouter}/bundles/router-testing.umd.js',

    'rxjs': 'npm:rxjs@${versions.rxjs}',
    'typescript': 'npm:typescript@${versions.typescript}/lib/typescript.js',

    '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap@${versions.ngBootstrap}/bundles/ng-bootstrap.js'
  },
  packages: {
    app: {
      main: './main.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  }
});
`;
}

function getVersions() {
  return {
    angular: getVersion('@angular/core'),
    angularRouter: getVersion('@angular/router'),
    typescript: getVersion('typescript'),
    rxjs: getVersion('rxjs'),
    ngBootstrap: packageJson.version,
    zoneJs: getVersion('zone.js'),
    systemjs: getVersion('systemjs'),
    reflectMetadata: getVersion('reflect-metadata')
  };
}

function getVersion(name) {
  var value = packageJson.dependencies[name] || packageJson.devDependencies[name];
  if (!value) {
    throw `couldn't find version for ${name} in package.json`;
  }
  return value;
}

module.exports = generatePlnkrContent;
