import * as ts from 'typescript';
import * as glob from 'glob';

const BOOTSTRAP_REGEX = new RegExp(/bootstrap:[\s]*\[[\s]*(.*?)[\s,]*]/m);
const SELECTOR_REGEX = new RegExp(/selector:[\s]*['"`]([^'"`]*)['"`]/m);

export interface DemoMetadata {
  bootstrapComponentSelector: string;
  moduleClassName: string;
}

/**
 * For a given demo folder extracts:
 *
 *  - class name of the demo module
 *  - the component selector of the `MyComponent` in `bootstrap: [MyComponent]`
 */
export function parseDemo(demoPath: string): DemoMetadata {
  const componentSelectors = new Map<string, string>();
  let bootstrapComponent: string = null;
  let bootstrapComponentSelector: string;
  let moduleClassName: string = null;

  function processFile(sourceFile: ts.SourceFile) {
    parseNode(sourceFile);

    function parseNode(node: ts.Node) {
      switch (node.kind) {
        case ts.SyntaxKind.Decorator:
          const decorator = <ts.Decorator>node;

          if (decorator.parent && decorator.parent.kind === ts.SyntaxKind.ClassDeclaration) {
            const className = (<ts.ClassDeclaration>decorator.parent).name.getText(sourceFile);
            const textDecorator = decorator.getText(sourceFile);

            if (textDecorator.startsWith('@NgModule')) {
              moduleClassName = className;

              const matches = BOOTSTRAP_REGEX.exec(textDecorator);
              if (matches) {
                bootstrapComponent = matches[1];
              }
            }

            if (textDecorator.startsWith('@Component')) {
              const matches = SELECTOR_REGEX.exec(textDecorator);
              if (matches) {
                componentSelectors.set(className, matches[1]);
              }
            }
          }
      }

      ts.forEachChild(node, parseNode);
    }
  }

  // start
  glob.sync(`${demoPath}/**/*.ts`).forEach(sourceFile => {
    const program = ts.createProgram([sourceFile], {});
    program.getTypeChecker();
    processFile(program.getSourceFile(sourceFile));
  });

  // checks
  if (!moduleClassName) {
    throw new Error(`Couldn't find any NgModules in ${demoPath}`);
  }

  if (!bootstrapComponent) {
    throw new Error(`Couldn't find any bootstrap components in ${moduleClassName} in ${demoPath}`);
  }

  bootstrapComponentSelector = componentSelectors.get(bootstrapComponent);
  if (!bootstrapComponentSelector) {
    throw new Error(
        `Couldn't get bootstrap component selector for component ${bootstrapComponent} in ${moduleClassName} in ${demoPath}`);
  }

  return {bootstrapComponentSelector, moduleClassName};
}
