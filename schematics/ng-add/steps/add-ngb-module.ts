import {Rule, SchematicsException, Tree} from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {getProject} from '@schematics/angular/utility/project';
import {getAppModulePath} from '@schematics/angular/utility/ng-ast-utils';
import {addImportToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange} from '@schematics/angular/utility/change';
import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

import {Schema} from '../schema';
import {getProjectTargetOptions} from '../../utils/project';


const NG_BOOTSTRAP_MODULE_NAME = 'NgbModule';
const NG_BOOTSTRAP_PACKAGE_NAME = '@ng-bootstrap/ng-bootstrap';

/**
 * Patches main application module by adding 'NgbModule' import
 */
export function addNgbModuleToAppModule(options: Schema): Rule {
  return (host: Tree) => {
    const workspace = getWorkspace(host);
    const project = getProject(workspace, options.project || workspace.defaultProject !);
    const buildOptions = getProjectTargetOptions(project, 'build');

    const modulePath = getAppModulePath(host, buildOptions.main);

    const text = host.read(modulePath);
    if (text === null) {
      throw new SchematicsException(`File '${modulePath}' does not exist.`);
    }

    const source = ts.createSourceFile(modulePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);

    const changes = addImportToModule(source, modulePath, NG_BOOTSTRAP_MODULE_NAME, NG_BOOTSTRAP_PACKAGE_NAME);

    const recorder = host.beginUpdate(modulePath);
    for (const change of changes) {
      if (change instanceof InsertChange) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(recorder);
    return host;
  };
}
