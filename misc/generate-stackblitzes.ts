// tslint:disable:max-line-length
import * as glob from 'glob';
import * as fs from 'fs-extra';
import * as he from 'he';

const stackblitzUrl = 'https://run.stackblitz.com/api/angular/v1/';

const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
const ngBootstrap = JSON.parse(fs.readFileSync('src/package.json').toString()).version;
const versions = getVersions();

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const ENTRY_CMPTS = {
  'modal-component': ['NgbdModalContent'],
  'modal-stacked': ['NgbdModal1Content', 'NgbdModal2Content'],
  'modal-focus': ['NgbdModalConfirm', 'NgbdModalConfirmAutofocus']
};

function generateDemosCSS() {
  return fs.readFileSync('demo/src/style/demos.css').toString();
}

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
    <input type="hidden" name="files[styles.css]" value="${he.encode(generateDemosCSS())}">
    <input type="hidden" name="files[app/app.module.ts]" value="${he.encode(generateAppModuleTsContent(componentName, demoName, basePath + '.ts'))}">
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.15.0/themes/prism.css" />
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

function generateAppModuleTsContent(componentName, demoName, filePath) {
  const demoClassName = `Ngbd${capitalize(componentName)}${capitalize(demoName)}`;
  const demoImport = `./${componentName}-${demoName}`;
  const entryCmptClasses = (ENTRY_CMPTS[`${componentName}-${demoName}`] || []).join(', ');
  const demoImports = entryCmptClasses ? `${demoClassName}, ${entryCmptClasses}` : demoClassName;
  const file = fs.readFileSync(filePath).toString();
  if (!file.includes(demoClassName)) {
    throw new Error(`Expecting demo class name in ${filePath} to be '${demoClassName}' (note the case)`);
  }

  return `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ${demoImports} } from '${demoImport}';

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, NgbModule],
  declarations: [AppComponent, ${demoImports}]${entryCmptClasses ? `,\n  entryComponents: [${entryCmptClasses}],` : ','}
  bootstrap: [AppComponent]
})
export class AppModule {}
`;
}

function generateTags(tags) {
  return tags.map((tag, idx) => `    <input type="hidden" name="tags[${idx}]" value="${tag}">`).join('\n');
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
  };
}

function getVersions() {
  return {
    angular: getVersion('@angular/core'),
    typescript: getVersion('typescript'),
    rxjs: getVersion('rxjs'), ngBootstrap,
    zoneJs: getVersion('zone.js'),
    coreJs: getVersion('core-js'),
    reflectMetadata: getVersion(
        'reflect-metadata', JSON.parse(fs.readFileSync('node_modules/@angular/compiler-cli/package.json').toString())),
    bootstrap: getVersion('bootstrap')
  };
}

function getVersion(name, givenPackageJson?: {dependencies, devDependencies}) {
  if (!givenPackageJson) {
    givenPackageJson = packageJson;
  }

  const value = givenPackageJson.dependencies[name] || givenPackageJson.devDependencies[name];

  if (!value) {
    throw `couldn't find version for ${name} in package.json`;
  }

  return value;
}

function getDemoComponentNames(): string[] {
  const path = 'demo/src/app/components/*/';

  return glob.sync(path, {})
      .map(dir => dir.substr(0, dir.length - 1))
      .map(dirNoEndingSlash => dirNoEndingSlash.substr(dirNoEndingSlash.lastIndexOf('/') + 1))
      .sort();
}

function getDemoNames(componentName: string): string[] {
  const path = `demo/src/app/components/${componentName}/demos/*/`;

  return glob.sync(path, {})
      .map(dir => dir.substr(0, dir.length - 1))
      .map(dirNoEndingSlash => dirNoEndingSlash.substr(dirNoEndingSlash.lastIndexOf('/') + 1))
      .sort();
}

/**
 * Generates StackBlitzes for all demos of all components and puts
 * resulting html files to the public folder of the demo application
 */

const base = `demo/src/public/app/components`;

// removing folder
fs.ensureDirSync(base);
fs.emptyDirSync(base);

// re-creating all stackblitzes
getDemoComponentNames().forEach(componentName => {
  getDemoNames(componentName).forEach(demoName => {
    const file = `${base}/${componentName}/demos/${demoName}/stackblitz.html`;
    fs.ensureFileSync(file);
    fs.writeFileSync(file, generateStackblitzContent(componentName, demoName));
  });
});
