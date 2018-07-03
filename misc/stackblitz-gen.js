const fs = require('fs');
const he = require('he');
const capitalize = require('./demo-gen-utils').capitalize;

const stackblitzUrl = 'https://run.stackblitz.com/api/angular/v1/';

const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
const ngBootstrap = JSON.parse(fs.readFileSync('src/package.json').toString()).version;
const versions = getVersions();

const ENTRY_CMPTS = {
  modal: ['component']
};

function generateStackblitzContent(componentName, demoName) {
  const fileName = `${componentName}-${demoName}`;
  const basePath = `demo/src/app/components/${componentName}/demos/${demoName}/${fileName}`;

  const codeContent = fs.readFileSync(`${basePath}.ts`).toString();
  const markupContent = fs.readFileSync(`${basePath}.html`).toString();

  return `<!DOCTYPE html>
<html lang="en">
<body>
  <form id="mainForm" method="post" action="${stackblitzUrl}">
    <input type="hidden" name="description" value="Example usage of the ${componentName} widget from https://ng-bootstrap.github.io">
${generateTags(['Angular', 'Bootstrap', 'ng-bootstrap', capitalize(componentName)])}  

    <input type="hidden" name="files[.angular-cli.json]" value="${he.encode(getStackblitzTemplate('.angular-cli.json'))}">
    <input type="hidden" name="files[index.html]" value="${he.encode(generateIndexHtml())}">
    <input type="hidden" name="files[main.ts]" value="${he.encode(getStackblitzTemplate('main.ts'))}">
    <input type="hidden" name="files[polyfills.ts]" value="${he.encode(getStackblitzTemplate('polyfills.ts'))}">
    <input type="hidden" name="files[styles.css]" value="${he.encode(getStackblitzTemplate('styles.css'))}">
    <input type="hidden" name="files[app/app.module.ts]" value="${he.encode(generateAppModuleTsContent(componentName, demoName))}">
    <input type="hidden" name="files[app/app.component.ts]" value="${he.encode(getStackblitzTemplate('app/app.component.ts'))}">
    <input type="hidden" name="files[app/app.component.html]" value="${he.encode(generateAppComponentHtmlContent(componentName, demoName))}">
    <input type="hidden" name="files[app/${fileName}.ts]" value="${he.encode(codeContent)}">
    <input type="hidden" name="files[app/${fileName}.html]" value="${he.encode(markupContent)}">
    
    <input type="hidden" name="dependencies" value="${he.encode(JSON.stringify(generateDependencies()))}">
  </form>
  <script>document.getElementById("mainForm").submit();</script>
</body>
</html>`;
}

function getStackblitzTemplate(path) {
  return fs.readFileSync(`misc/stackblitz-builder-templates/${path}`).toString();
}

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html>

  <head>
    <title>ng-bootstrap demo</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/${versions.bootstrap}/css/bootstrap.min.css" />
  </head>

  <body>
    <my-app>loading...</my-app>
  </body>
  
</html>`;
}

function generateAppComponentHtmlContent(componentName, demoName) {
  const demoSelector = `ngbd-${componentName}-${demoName}`;

  return `
<div class="container-fluid">
    
  <hr>

  <p>
    This is a demo example forked from the <strong>ng-bootstrap</strong> project: Angular powered Bootstrap.
    Visit <a href="https://ng-bootstrap.github.io/" target="_blank">https://ng-bootstrap.github.io</a> for more widgets and demos.
  </p>

  <hr>

  <${demoSelector}></${demoSelector}>
</div>
`;
}

function generateAppModuleTsContent(componentName, demoName) {
  const demoClassName = `Ngbd${capitalize(componentName)}${capitalize(demoName)}`;
  const demoImport = `./${componentName}-${demoName}`;
  const needsEntryCmpt = ENTRY_CMPTS.hasOwnProperty(componentName) && ENTRY_CMPTS[componentName].indexOf(demoName) > -1;
  const entryCmptClass =  needsEntryCmpt ? `Ngbd${capitalize(componentName)}Content` : null;
  const demoImports = needsEntryCmpt ? `${demoClassName}, ${entryCmptClass}` : demoClassName;

  return `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ${demoImports} } from '${demoImport}';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule.forRoot()], 
  declarations: [AppComponent, ${demoImports}]${needsEntryCmpt ? `,\n  entryComponents: [${entryCmptClass}],` : ','}
  bootstrap: [AppComponent]
}) 
export class AppModule {}
`;
}

function generateTags(tags) {
  return tags.map((tag, idx) => {
    return `    <input type="hidden" name="tags[${idx}]" value="${tag}">`;
}).join('\n');
}

function generateDependencies() {
  return {
    '@angular/core': versions.angular,
    '@angular/common': versions.angular,
    '@angular/compiler': versions.angular,
    '@angular/platform-browser': versions.angular,
    '@angular/platform-browser-dynamic': versions.angular,
    '@angular/router': versions.angular,
    '@angular/forms': versions.angular,
    '@ng-bootstrap/ng-bootstrap': versions.ngBootstrap,
    'core-js': versions.coreJs,
    'rxjs': versions.rxjs,
    'zone.js': versions.zoneJs,
  }
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

module.exports = generateStackblitzContent;
