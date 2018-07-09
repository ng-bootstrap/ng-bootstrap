const fs = require('fs');
const he = require('he');
const capitalize = require('./demo-gen-utils').capitalize;

const plnkrUrl = 'http://plnkr.co/edit/?p=preview';

const contentMainTs = fs.readFileSync('misc/plunker-builder-templates/main.ts').toString();
const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
const ngBootstrap = JSON.parse(fs.readFileSync('src/package.json').toString()).version;
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
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ${demoImports} } from '${demoImport}';

@Component({
  selector: 'my-app',
  template: \`
    <div class="container-fluid">

    <hr>
    <p>
      This is a demo plnkr forked from the <strong>ng-bootstrap</strong> project: Angular powered Bootstrap.
      Visit <a href="https://ng-bootstrap.github.io/" target="_blank">https://ng-bootstrap.github.io</a> for more widgets and demos.
    </p>
    <hr>

    <${demoSelector}></${demoSelector}>
  </div>
  \`
})
export class App {
}

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot()],
  declarations: [App, ${demoImports}]${needsEntryCmpt ? `,\n  entryComponents: [${entryCmptClass}],` : ','}
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
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/${versions.bootstrap}/css/bootstrap.min.css" />
    <script src="https://unpkg.com/core-js@${versions.coreJs}/client/shim.js"></script>
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
  return `var ver = {
    ng: '${versions.angular}'
  };

  System.config({
  //use typescript for compilation
  transpiler: 'typescript',
  //typescript compiler options
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  meta: {
    'typescript': {
      "exports": "ts"
    }
  },
  paths: {
    'npm:': 'https://unpkg.com/'
  },
  map: {

    'app': './src',

    '@angular/core': 'npm:@angular/core@' + ver.ng + '/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common@' + ver.ng + '/bundles/common.umd.js',
    '@angular/common/http': 'npm:@angular/common@' + ver.ng + '/bundles/common-http.umd.js',
    '@angular/compiler': 'npm:@angular/compiler@' + ver.ng + '/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser@' + ver.ng + '/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic@' + ver.ng + '/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http@' + ver.ng + '/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router@' + ver.ng + '/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms@' + ver.ng + '/bundles/forms.umd.js',

    'rxjs': 'npm:rxjs@${versions.rxjs}',
    'tslib': 'npm:tslib/tslib.js',
    'typescript': 'npm:typescript@${versions.typescript}/lib/typescript.js',

    '@ng-bootstrap/ng-bootstrap': 'npm:@ng-bootstrap/ng-bootstrap@${versions.ngBootstrap}/bundles/ng-bootstrap.umd.js'
  },
  packages: {
    app: {
      main: './main.ts',
      defaultExtension: 'ts'
    },
    rxjs: {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'rxjs/operators': {
      main: 'index.js',
      defaultExtension: 'js'
    }
  }
});
`;
}

function getVersions() {
  return {
    angular: getVersion('@angular/core'),
    typescript: getVersion('typescript'),
    rxjs: getVersion('rxjs'),
    ngBootstrap,
    zoneJs: getVersion('zone.js'),
    coreJs: getVersion('core-js'),
    systemjs: '^0.19.40',
    reflectMetadata: getVersion('reflect-metadata', JSON.parse(fs.readFileSync('node_modules/@angular/compiler-cli/package.json').toString())),
    bootstrap: getVersion('bootstrap')
  };
}

function getVersion(name, givenPackageJson) {
  if (givenPackageJson == null) {
    givenPackageJson = packageJson;
  }

  var value = givenPackageJson.dependencies[name] || givenPackageJson.devDependencies[name];

  if (!value) {
    throw `couldn't find version for ${name} in package.json`;
  }

  return value;
}

module.exports = generatePlnkrContent;
