'use strict';

var ts = require('typescript');
var fs = require('fs');

function getNamesCompareFn(name) {
  name = name || 'name';
  return (a, b) => a[name].localeCompare(b[name]);
}

const ANGULAR_LIFECYCLE_METHODS = [
  'ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngOnDestroy', 'ngAfterContentInit', 'ngAfterContentChecked',
  'ngAfterViewInit', 'ngAfterViewChecked'
];

function isInternalMember(member) {
  const jsDoc = ts.displayPartsToString(member.symbol.getDocumentationComment());
  return jsDoc.indexOf('@internal') > -1;
}

function isAngularLifecycleHook(methodName) {
  return ANGULAR_LIFECYCLE_METHODS.indexOf(methodName) >= 0;
}

class APIDocVisitor {
  constructor(fileNames) {
    this.program = ts.createProgram(fileNames, {});
    this.typeChecker = this.program.getTypeChecker(true);
  }


  visitSourceFile(fileName) {
    var sourceFile = this.program.getSourceFile(fileName);

    if (!sourceFile) {
      throw new Error(`File doesn't exist: ${fileName}.`)
    }

    return sourceFile.statements.reduce((directivesSoFar, statement) => {
      if (statement.kind === ts.SyntaxKind.ClassDeclaration) {
        return directivesSoFar.concat(this.visitClassDeclaration(fileName, statement));
      }

      return directivesSoFar;
    }, []);
  }

  visitClassDeclaration(fileName, classDeclaration) {
    var symbol = this.program.getTypeChecker().getSymbolAtLocation(classDeclaration.name);
    var description = ts.displayPartsToString(symbol.getDocumentationComment());
    var className = classDeclaration.name.text;
    var directiveInfo;
    var members;

    if (classDeclaration.decorators) {
      for (var i = 0; i < classDeclaration.decorators.length; i++) {
        if (this.isDirectiveDecorator(classDeclaration.decorators[i])) {
          directiveInfo = this.visitDirectiveDecorator(classDeclaration.decorators[i]);
          members = this.visitMembers(classDeclaration.members);

          return [{
            fileName,
            className,
            description,
            selector: directiveInfo.selector,
            exportAs: directiveInfo.exportAs,
            inputs: members.inputs,
            outputs: members.outputs,
            methods: members.methods
          }];
        } else if (this.isServiceDecorator(classDeclaration.decorators[i])) {
          members = this.visitMembers(classDeclaration.members);

          return [{fileName, className, description, methods: members.methods}];
        }
      }
    }

    // a class that is not a directive or a service, not documented for now
    return [];
  }

  visitDirectiveDecorator(decorator) {
    var selector;
    var exportAs;
    var properties = decorator.expression.arguments[0].properties;

    for (var i = 0; i < properties.length; i++) {
      if (properties[i].name.text === 'selector') {
        // TODO: this will only work if selector is initialized as a string literal
        selector = properties[i].initializer.text;
      }
      if (properties[i].name.text === 'exportAs') {
        // TODO: this will only work if selector is initialized as a string literal
        exportAs = properties[i].initializer.text;
      }
    }

    return {selector, exportAs};
  }

  visitMembers(members) {
    var inputs = [];
    var outputs = [];
    var methods = [];
    var inputDecorator, outDecorator;

    for (var i = 0; i < members.length; i++) {
      inputDecorator = this.getDecoratorOfType(members[i], 'Input');
      outDecorator = this.getDecoratorOfType(members[i], 'Output');

      if (inputDecorator) {
        inputs.push(this.visitInput(members[i], inputDecorator));

      } else if (outDecorator) {
        outputs.push(this.visitOutput(members[i], outDecorator));

      } else {
        if (members[i].kind === ts.SyntaxKind.MethodDeclaration) {
          if ((members[i].flags & ts.NodeFlags.Private) === 0 && !isAngularLifecycleHook(members[i].name.text) &&
              !isInternalMember(members[i])) {
            methods.push(this.visitMethodDeclaration(members[i]));
          }
        }
      }
    }

    inputs.sort(getNamesCompareFn());
    outputs.sort(getNamesCompareFn());

    return {inputs, outputs, methods};
  }

  visitMethodDeclaration(method) {
    return {
      name: method.name.text, description: ts.displayPartsToString(method.symbol.getDocumentationComment()),
          args: method.parameters ? method.parameters.map((prop) => this.visitArgument(prop)) : [],
          returnType: this.visitType(method.type)
    }
  }

  visitArgument(arg) {
    return { name: arg.name.text, type: this.visitType(arg) }
  }

  visitInput(property, inDecorator) {
    var inArgs = inDecorator.expression.arguments;
    return {
      name: inArgs.length ? inArgs[0].text : property.name.text,
      defaultValue: property.initializer ? this.stringifyDefaultValue(property.initializer) : undefined,
      type: this.visitType(property),
      description: ts.displayPartsToString(property.symbol.getDocumentationComment())
    };
  }

  stringifyDefaultValue(node) {
    if (node.text) {
      return node.text;
    } else if (node.kind === ts.SyntaxKind.FalseKeyword) {
      return 'false';
    } else if (node.kind === ts.SyntaxKind.TrueKeyword) {
      return 'true';
    }
  }

  visitOutput(property, outDecorator) {
    var outArgs = outDecorator.expression.arguments;
    return {
      name: outArgs.length ? outArgs[0].text : property.name.text,
      description: ts.displayPartsToString(property.symbol.getDocumentationComment())
    };
  }

  visitType(node) { return node ? this.typeChecker.typeToString(this.typeChecker.getTypeAtLocation(node)) : 'void'; }

  isDirectiveDecorator(decorator) {
    var decoratorIdentifierText = decorator.expression.expression.text;
    return decoratorIdentifierText === 'Directive' || decoratorIdentifierText === 'Component';
  }

  isServiceDecorator(decorator) { return decorator.expression.expression.text === 'Injectable'; }

  getDecoratorOfType(node, decoratorType) {
    var decorators = node.decorators || [];

    for (var i = 0; i < decorators.length; i++) {
      if (decorators[i].expression.expression.text === decoratorType) {
        return decorators[i];
      }
    }

    return null;
  }
}

function parseOutApiDocs(programFiles) {
  var apiDocVisitor = new APIDocVisitor(programFiles);

  return programFiles.reduce(
      (soFar, file) => {
        var directivesInFile = apiDocVisitor.visitSourceFile(file);

        directivesInFile.forEach((directive) => { soFar[directive.className] = directive; });

        return soFar;
      },
      {});
}

module.exports = parseOutApiDocs;
