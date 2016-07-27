const fs = require('fs');
const he = require('he');
const capitalize = require('./demo-gen-utils').capitalize;

const plnkrUrl = 'http://plnkr.co/edit/?p=preview';

const contentIndexHtml = fs.readFileSync('misc/plunker-builder-templates/index.html').toString();
const contentConfigJs = fs.readFileSync('misc/plunker-builder-templates/config.js').toString();
const contentMainTs = fs.readFileSync('misc/plunker-builder-templates/main.ts').toString();

function generateAppTsContent(componentName, demoName) {
  const demoClassName = `Ngbd${capitalize(componentName)}${capitalize(demoName)}`;
  const demoImport = `./${componentName}-${demoName}`;
  const demoSelector = `ngbd-${componentName}-${demoName}`;

  return `
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ${demoClassName} } from '${demoImport}';

@Component({
  selector: 'my-app',
  template: \`
    <div class="container-fluid">
    
    <hr>
    <p>
      This is a demo plnkr forked from the <strong>ng-bootstrap</strong> project: Angular 2 powered Bootstrap.
      Visit <a href="https://ng-bootstrap.github.io/" target="_blank">https://ng-bootstrap.github.io</a> for more widgets and demos.
    </p>
    <hr>${componentName === 'modal' ? '\n<template ngbModalContainer></template>\n' : ''}

    <${demoSelector}></${demoSelector}>
  </div>
  \`
})
export class App {
}   

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, JsonpModule, NgbModule.forRoot()], 
  declarations: [App, ${demoClassName}],
  bootstrap: [App]
}) 
export class AppModule {}
`;
}

function generateTags(tags) {
  return tags.map((tag, idx) => {
    return `<input type="hidden" name="tags[${idx}]" value="${tag}">`;
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
    <input type="hidden" name="files[index.html]" value="${he.encode(contentIndexHtml)}">
    <input type="hidden" name="files[config.js]" value="${he.encode(contentConfigJs)}">
    <input type="hidden" name="files[src/main.ts]" value="${he.encode(contentMainTs)}">
    <input type="hidden" name="files[src/app.ts]" value="${he.encode(generateAppTsContent(componentName, demoName))}">
    <input type="hidden" name="files[src/${fileName}.ts]" value="${he.encode(codeContent.replace(`./${demoTplPath}`, `src/${demoTplPath}`))}">
    <input type="hidden" name="files[src/${fileName}.html]" value="${he.encode(markupContent)}">
  </form>
  <script>document.getElementById("mainForm").submit();</script>
/body>
</html>`;
}

module.exports = generatePlnkrContent;
