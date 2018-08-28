'use strict';

var ts = require('typescript');
var fs = require('fs');

function getNamesCompareFn(name) {
  name = name || 'name';
  return (a, b) => a[name].localeCompare(b[name]);
}

const ANGULAR_LIFECYCLE_METHODS = [
  'ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngOnDestroy', 'ngAfterContentInit', 'ngAfterContentChecked',
  'ngAfterViewInit', 'ngAfterViewChecked', 'writeValue', 'registerOnChange', 'registerOnTouched', 'setDisabledState'
];

function hasNoJSDoc(member) {
  if (!member.symbol) {
    return true;
  }

  const jsDoc = ts.displayPartsToString(member.symbol.getDocumentationComment());
  return jsDoc.trim().length === 0;
}

function isInternalMember(member) {
  if (member.jsDoc && member.jsDoc.length > 0) {
    for (var i = 0; i < member.jsDoc.length; i++) {
      if (member.jsDoc[i].tags && member.jsDoc[i].tags.length > 0) {
        for (var j = 0; j < member.jsDoc[i].tags.length; j++) {
          if (member.jsDoc[i].tags[j].tagName.text === 'internal') {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function isAngularLifecycleHook(methodName) {
  return ANGULAR_LIFECYCLE_METHODS.indexOf(methodName) >= 0;
}

function isPrivate(member) {
  return (ts.getCombinedModifierFlags(member) & ts.ModifierFlags.Private) !== 0;
}

function isPrivateOrInternal(member) {
  return isPrivate(member) || hasNoJSDoc(member) || isInternalMember(member);
}

function getJsDocTags(symbol) {
  // clang-format off
  return !symbol ? {}
    : symbol.getJsDocTags()
        .filter(el => ['deprecated', 'since'].includes(el.name))
        .reduce(
          (obj, el) => {
            const[version, ...rest] = el.text.split(' ');
            obj[el.name] = {version, description: rest.join(' ').trim()};
            return obj;
          }, {}
        );
  // clang-format on
}

function getTypeParameter(program, declaration) {
  // getting type of 'Class <T = number>'
  var type = program.getTypeChecker().getTypeAtLocation(declaration);

  // checking if '<...>' part is present
  if (type.typeParameters) {
    // getting 'T' parameter from declaration
    var parameter = type.typeParameters[0].symbol;
    var parameterString = parameter.getName();

    // checking if there is a default type value (ex. '= number')
    var defaultType = program.getTypeChecker().getTypeAtLocation(parameter.getDeclarations()[0].default);

    // default type can be a 'unknown', base type (ex. 'number') or another symbol
    if (defaultType && defaultType.intrinsicName !== 'unknown') {
      parameterString +=
          defaultType.intrinsicName ? ` = ${defaultType.intrinsicName}` : ` = ${defaultType.symbol.getName()}`;
    }
    return parameterString;
  } else {
    return undefined;
  }
}

class APIDocVisitor {
  constructor(fileNames) {
    this.program = ts.createProgram(fileNames, {lib: ["lib.es6.d.ts"]});
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
      } else if (statement.kind === ts.SyntaxKind.InterfaceDeclaration) {
        return directivesSoFar.concat(this.visitInterfaceDeclaration(fileName, statement));
      }

      return directivesSoFar;
    }, []);
  }

  visitInterfaceDeclaration(fileName, interfaceDeclaration) {
    var symbol = this.program.getTypeChecker().getSymbolAtLocation(interfaceDeclaration.name);
    var description = ts.displayPartsToString(symbol.getDocumentationComment());
    var {deprecated, since} = getJsDocTags(symbol);
    var className = interfaceDeclaration.name.text;
    var typeParameter = getTypeParameter(this.program, interfaceDeclaration.name);
    var members = this.visitMembers(interfaceDeclaration.members);

    return [{
      fileName,
      className,
      description,
      deprecated,
      since,
      typeParameter,
      type: 'Interface',
      methods: members.methods,
      properties: members.properties
    }];
  }

  visitClassDeclaration(fileName, classDeclaration) {
    var symbol = this.program.getTypeChecker().getSymbolAtLocation(classDeclaration.name);
    var description = ts.displayPartsToString(symbol.getDocumentationComment());
    var {deprecated, since} = getJsDocTags(symbol);
    var className = classDeclaration.name.text;
    var typeParameter = getTypeParameter(this.program, classDeclaration.name);
    var decorators = classDeclaration.decorators;
    var directiveInfo;
    var members;

    // If there is no top documentation comment, consider it private, we skip it.
    if (!description) {
      return [];
    }

    if (decorators) {
      for (var i = 0; i < decorators.length; i++) {
        if (this.isDirectiveDecorator(decorators[i])) {
          directiveInfo = this.visitDirectiveDecorator(decorators[i]);
          members = this.visitMembers(classDeclaration.members);

          return [{
            fileName,
            className,
            description,
            deprecated,
            since,
            typeParameter,
            type: directiveInfo.type,
            selector: directiveInfo.selector,
            exportAs: directiveInfo.exportAs,
            inputs: members.inputs,
            outputs: members.outputs,
            properties: members.properties,
            methods: members.methods
          }];
        } else if (this.isServiceDecorator(decorators[i])) {
          members = this.visitMembers(classDeclaration.members);

          return [{
            fileName,
            className,
            description,
            deprecated,
            since,
            typeParameter,
            type: 'Service',
            methods: members.methods,
            properties: members.properties
          }];
        }
      }
    } else if (description) {
      members = this.visitMembers(classDeclaration.members);

      return [{
        fileName,
        className,
        description,
        deprecated,
        since,
        type: 'Class',
        methods: members.methods,
        properties: members.properties
      }];
    }

    // a class that is not a directive or a service, not documented for now
    return [];
  }

  visitDirectiveDecorator(decorator) {
    var selector;
    var exportAs;
    var properties = decorator.expression.arguments[0].properties;
    var type = decorator.expression.expression.text;

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

    return {selector, exportAs, type};
  }

  visitMembers(members) {
    var inputs = [];
    var outputs = [];
    var methods = [];
    var properties = [];
    var inputDecorator, outDecorator;

    for (var i = 0; i < members.length; i++) {
      inputDecorator = this.getDecoratorOfType(members[i], 'Input');
      outDecorator = this.getDecoratorOfType(members[i], 'Output');
      var {deprecated, since} = getJsDocTags(members[i].symbol);
      var releaseInfo = {deprecated, since};

      if (inputDecorator) {
        inputs.push(Object.assign(this.visitInput(members[i], inputDecorator), releaseInfo));

      } else if (outDecorator) {
        outputs.push(Object.assign(this.visitOutput(members[i], outDecorator), releaseInfo));

      } else if (
          (members[i].kind === ts.SyntaxKind.MethodDeclaration || members[i].kind === ts.SyntaxKind.MethodSignature) &&
          !isAngularLifecycleHook(members[i].name.text) && !isPrivateOrInternal(members[i])) {
        methods.push(Object.assign(this.visitMethodDeclaration(members[i]), releaseInfo));
      } else if (
          (members[i].kind === ts.SyntaxKind.PropertyDeclaration ||
           members[i].kind === ts.SyntaxKind.PropertySignature || members[i].kind === ts.SyntaxKind.GetAccessor) &&
          !isPrivate(members[i]) && !isInternalMember(members[i])) {
        properties.push(Object.assign(this.visitProperty(members[i]), releaseInfo));
      }
    }

    inputs.sort(getNamesCompareFn());
    outputs.sort(getNamesCompareFn());
    properties.sort(getNamesCompareFn());

    return {inputs, outputs, methods, properties};
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

  visitProperty(property) {
    return {
      name: property.name.text,
      defaultValue: property.initializer ? this.stringifyDefaultValue(property.initializer) : undefined,
      type: this.visitType(property),
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
