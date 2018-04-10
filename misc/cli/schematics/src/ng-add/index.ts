import {Rule, Tree, chain, SchematicContext} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson} from './../utils/package';
import {addModuleImportToRootModule} from './../utils/ast';
import {addStyle} from './../utils/config';

// TODO(PK): add the one from package.json from now, in the future I will have to maintain
// mapping of compatible Angular / Bootstrap versions
const ngBootstrapVersion = '1.1.1';
const bootstrapVersion = '4.0.0';

function addNgBootstrapToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', '@ng-bootstrap/ng-bootstrap', ngBootstrapVersion);
    return host;
  };
}

function addNgBootstrapModuleToAppModule(): Rule {
  return (host: Tree) => {
    addModuleImportToRootModule(host, 'NgbModule.forRoot()', '@ng-bootstrap/ng-bootstrap');
    return host;
  };
}

function addBootstrapToPackageJson(): Rule {
  return (host: Tree) => {
    addPackageToPackageJson(host, 'dependencies', 'bootstrap', bootstrapVersion);
    return host;
  };
}

function addBootstrapCSS(): Rule {
  return (host: Tree) => {
    addStyle(host, './node_modules/bootstrap/dist/css/bootstrap.css');
    return host;
  };
}

function installNodeDeps() {
  return (host: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
  }
}

export default function ngAdd(): Rule {
  return chain([
    // ng-bootstrap part
    addNgBootstrapToPackageJson(),
    addNgBootstrapModuleToAppModule(),

    // Bootstrap CSS part
    addBootstrapToPackageJson(),
    addBootstrapCSS(),

    // install freshly added dependencies
    installNodeDeps()
  ]);
}
