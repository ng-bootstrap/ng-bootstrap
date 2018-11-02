// tslint:disable:max-line-length
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as he from 'he';
import {basename, dirname, join, normalize} from 'path';

/**
 * Generates StackBlitzes for all demos of all components and puts
 * resulting html files to the public folder of the demo application
 */

const stackblitzUrl = 'https://run.stackblitz.com/api/angular/v1/';
const sourceBase = 'demo/src/app/components';
const componentGlob = `${sourceBase}/*`;
const generationBase = `demo/src/public/app/components`;

const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
const ngBootstrap = JSON.parse(fs.readFileSync('src/package.json').toString()).version;
const versions = getVersions();

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getContent(path) {
  return fs.readFileSync(path).toString();
}

function generateDemosCSS() {
  return getContent('demo/src/style/demos.css');
}

function generateInput(filename, content) {
  return `<input type="hidden" name="${filename}" value="${he.encode(content)}">`;
}

function generateStackblitzContent(demo) {
  const {widget, demoName, demoSelector, demoClass, component, template, entryComponents} = demo;

  const basePath = join('demo/src/app/components', widget, component);
  const componentPath = `files[app/${basename(component)}]`;
  const templatePath = `files[app/${basename(template)}]`;

  const componentName = capitalize(widget);
  const codeContent = getContent(basePath);
  const markupContent = getContent(join('demo/src/app/components', widget, template));

  return `<!DOCTYPE html>
<html lang="en">
<body>
  <form id="mainForm" method="post" action="${stackblitzUrl}">
    <input type="hidden" name="description" value="Example usage of the ${componentName} widget from https://ng-bootstrap.github.io">
    ${generateTags(['Angular', 'Bootstrap', 'ng-bootstrap', componentName])}

    ${generateInput('files[.angular-cli.json]', getStackblitzTemplate('.angular-cli.json'))}
    ${generateInput('files[index.html]', generateIndexHtml())}
    ${generateInput('files[main.ts]', getStackblitzTemplate('main.ts'))}
    ${generateInput('files[polyfills.ts]', getStackblitzTemplate('polyfills.ts'))}
    ${generateInput('files[styles.css]', generateDemosCSS())}
    ${generateInput('files[app/app.module.ts]', generateAppModuleTsContent(widget, demoName, demoClass, basename(component, '.ts'), entryComponents))}
    ${generateInput('files[app/app.component.ts]', getStackblitzTemplate('app/app.component.ts'))}
    ${generateInput('files[app/app.component.html]', generateAppComponentHtmlContent(demoSelector))}
    ${generateInput(componentPath, codeContent)}
    ${generateInput(templatePath, markupContent)}
    ${generateInput('dependencies', JSON.stringify(generateDependencies()))}
  </form>
  <script>document.getElementById("mainForm").submit();</script>
</body>
</html>`;
}

function getStackblitzTemplate(path) {
  return getContent(`misc/stackblitz-builder-templates/${path}`);
}

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html>

  <head>
    <title>ng-bootstrap demo</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/${versions.bootstrap}/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/${versions.prismjs}/themes/prism.css" />
  </head>

  <body>
    <my-app>loading...</my-app>
  </body>

</html>`;
}

function generateAppComponentHtmlContent(demoSelector) {
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

function generateAppModuleTsContent(widget, demoName, demoClass, componentPath, entryComponents) {
  const entryCmptClasses = entryComponents.join(', ');
  const demoImports = entryCmptClasses ? `${demoClass}, ${entryCmptClasses}` : demoClass;

  return `
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { ${demoImports} } from './${componentPath}';

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
    reflectMetadata:
        getVersion('reflect-metadata', JSON.parse(getContent('node_modules/@angular/compiler-cli/package.json'))),
    bootstrap: getVersion('bootstrap'),
    prismjs: getVersion('prismjs').replace(/[~\^]/, '')
  };
}

function getVersion(name, givenPackageJson?: {dependencies, devDependencies}) {
  if (!givenPackageJson) {
    givenPackageJson = packageJson;
  }

  const value = givenPackageJson.dependencies[name] || givenPackageJson.devDependencies[name];

  if (!value) {
    console.error(`[Stackblitz generation error] couldn't find version for ${name} in package.json`);
    process.exit(1);
  }

  return value;
}

function getWidgetList(files): any[] {
  return glob.sync(files, {ignore: ['demo/src/app/components/shared']})
      .map(dir => basename(dir))
      .sort()
      .map(widget => ({widget, moduleName: `${widget}.module.ts`}));
}

/*
 * TODO: maybe use a regexp library in here (XRegExp ?)
 * Bunch of regular expressions to dynamically:
 * - extract the list of demos (looking up for DEMO_DIRECTIVES)
 * - get the actual filesystem path from the EcmaScript import of each demo directive
 * - get a demo selector from the demo component class
 * - get the template filesystem path for a component from the @Component decorator
 * - read entryComponent classes from the @NgModule decorator
 */
const DEMOS_LIST_DIRECTIVES = /^const DEMO_DIRECTIVES\s*=\s*\[([^\]]*)[\s\S]*\];/im;
const DEMOS_DIRECTIVES_IMPORT = demo =>
    new RegExp(`^import \\{[\\s,\\w]*${demo}[\\s,\\w]*\\}[\\s]*from[\\s]*['"]([^'"]*)['"];`, 'im');
const DEMO_METADATA = demo => new RegExp(
    `^@Component\\(\\{[\\s\\S\\w\\:]*selector\\:[\\s]*['"]([^'"]*)['"][\\s\\S\\w\\:]*templateUrl\\:[\\s]*['"]([^'"]*)['"][\\s\\S\\w\\:]*export class ${demo}`,
    'mi');
const ENTRY_COMPONENTS = /^[\s\S]*entryComponents\s*\:[\s\S]*\[([\s\S]*)\]/im;


// removing folder
fs.ensureDirSync(generationBase);
fs.emptyDirSync(generationBase);

// re-creating all stackblitzes
for (const { widget, moduleName } of getWidgetList(componentGlob)) {
  // Let's get a list of Demo Directive
  // const DEMO_DIRECTIVES = [ ... ]
  const moduleContent = getContent(`${sourceBase}/${widget}/${moduleName}`);
  const match = DEMOS_LIST_DIRECTIVES.exec(moduleContent);
  let demoComponents;
  if (match && match[1]) {
    demoComponents = match[1].split(',').map(demo => demo.trim());
  } else {
    console.error(
        `[Stackblitz generation error] No demo directive has been found in '${moduleName}' for widget ${widget}
module should have a declared variable 'const DEMO_DIRECTIVES = [...]'`);
    process.exit(1);
  }

  // Is there any entryComponents defined in the module which are not ...DEMO[_\w*]?_DIRECTIVES
  let entryComponentsDef: string[] = [];
  let list;
  try {
    [, list, ] = ENTRY_COMPONENTS.exec(moduleContent);
    if (list) {
      entryComponentsDef = list.split(',').map(cpt => cpt.trim()).filter(cpt => !!cpt.length && !cpt.startsWith('...'));
    }
  } catch (error) {
  }

  for (const demo of demoComponents) {
    let componentPath;
    let demoSelector;
    let template;
    let componentContent;
    let entryComponents = [];
    try {
      // Reading actual filepath/filename foreach demo from ECMA import
      [, componentPath, ] = DEMOS_DIRECTIVES_IMPORT(demo).exec(moduleContent);

      // Reading demo selector, and template filepath/filename from @Component decorator
      componentContent = getContent(`demo/src/app/components/${widget}/${componentPath}.ts`);
      [, demoSelector, template, ] = DEMO_METADATA(demo).exec(componentContent);
    } catch (error) {
      console.error(`[Stackblitz generation error] ${error}`);
      process.exit(1);
    }

    const demoName = basename(dirname(componentPath));

    // Checking for entryComponent definition that need to be included in final demo module
    entryComponentsDef.forEach(eCpt => {
      if (componentContent.includes(eCpt)) {
        entryComponents.push(eCpt);
      }
    });

    // Actual generation
    const file = `${generationBase}/${widget}/demos/${demoName}/stackblitz.html`;
    fs.ensureFileSync(file);
    const content = generateStackblitzContent({
      widget,
      entryComponents,
      demoName,
      demoSelector,
      demoClass: demo,
      component: `${componentPath}.ts`,
      template: normalize(`./demos/${demoName}/${template}`),
    });
    fs.writeFileSync(file, content);
  }
}
