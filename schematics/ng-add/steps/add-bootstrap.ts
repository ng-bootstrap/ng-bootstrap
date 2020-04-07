import * as path from 'path';
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {getProject} from '@schematics/angular/utility/project';
import {WorkspaceProject, WorkspaceSchema} from '@schematics/angular/utility/workspace-models';

import {Schema} from '../schema';
import * as messages from '../messages';
import {getProjectStyleFile, getProjectTargetOptions} from '../../utils/project';


const BOOTSTRAP_CSS_FILEPATH = 'node_modules/bootstrap/dist/css/bootstrap.min.css';
const SUPPORTED_BOOTSTRAP_STYLE_IMPORTS = {
  '.sass': `
/* Importing Bootstrap SCSS file. */
@import '~bootstrap/scss/bootstrap'
`,
  '.scss': `
/* Importing Bootstrap SCSS file. */
@import '~bootstrap/scss/bootstrap';
`
};

/**
 * Adding bootstrap either to 'styles.scss' or 'styles.sass'
 * If not possible, we're simply adding 'bootstrap.css' to the 'angular.json'
 */
export function addBootstrapStyles(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProject(workspace, options.project || workspace.defaultProject !);
    const styleFilePath = getProjectStyleFile(project) || '';
    const styleFileExtension = path.extname(styleFilePath);
    const styleFilePatch = SUPPORTED_BOOTSTRAP_STYLE_IMPORTS[styleFileExtension];

    // found supported styles
    if (styleFilePatch) {
      addBootstrapToStylesFile(host, styleFilePath, styleFilePatch);
    } else {
      // found some styles, but unsupported
      if (styleFileExtension !== '.css' && styleFileExtension !== '') {
        context.logger.warn(messages.unsupportedStyles(styleFilePath));
      }

      // just patching 'angular.json'
      addBootstrapToAngularJson(workspace, project, host);
    }
    return host;
  };
}

/**
 * Patches 'styles.scss' or 'styles.sass' to add Bootstrap snippet
 */
function addBootstrapToStylesFile(host: Tree, styleFilePath: string, styleFilePatch: string) {
  const styleContent = host.read(styleFilePath) !.toString('utf-8');

  const recorder = host.beginUpdate(styleFilePath);
  recorder.insertRight(styleContent.length, styleFilePatch);

  host.commitUpdate(recorder);
}

/**
 * Patches 'angular.json' to add 'bootstrap.css' styles
 */
function addBootstrapToAngularJson(workspace: WorkspaceSchema, project: WorkspaceProject, host: Tree) {
  const targetOptions = getProjectTargetOptions(project, 'build');
  if (!targetOptions.styles) {
    targetOptions.styles = [BOOTSTRAP_CSS_FILEPATH];
  } else {
    const existingStyles = targetOptions.styles.map((s) => typeof s === 'string' ? s : s.input);
    for (const[, stylePath] of existingStyles.entries()) {
      // If the given asset is already specified in the styles, we don't need to do anything.
      if (stylePath === BOOTSTRAP_CSS_FILEPATH) {
        return;
      }
    }
    targetOptions.styles.unshift(BOOTSTRAP_CSS_FILEPATH);
  }
  host.overwrite('angular.json', JSON.stringify(workspace, null, 2));
}
