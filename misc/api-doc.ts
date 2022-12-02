import {
	canHaveDecorators,
	ClassDeclaration,
	ClassElement,
	createProgram,
	Decorator,
	displayPartsToString,
	Expression,
	getCombinedModifierFlags,
	getDecorators,
	InterfaceDeclaration,
	isCallExpression,
	isClassDeclaration,
	isGetAccessor,
	isIdentifier,
	isInterfaceDeclaration,
	isMethodDeclaration,
	isMethodSignature,
	isObjectLiteralExpression,
	isPropertyAssignment,
	isPropertyDeclaration,
	isPropertySignature,
	isSetAccessorDeclaration,
	MethodDeclaration,
	MethodSignature,
	ModifierFlags,
	NamedDeclaration,
	Node,
	NodeArray,
	Program,
	PropertyDeclaration,
	PropertySignature,
	Symbol,
	TypeChecker,
	TypeElement,
} from 'typescript';

import * as marked from 'marked';

function displayPartsToHtml(displayParts: any): string {
	return marked(displayPartsToString(displayParts), { gfm: true }).trim();
}

const NAMED_COMPARE = (a, b) => a['name'].localeCompare(b['name']);

const ANGULAR_LIFECYCLE_METHODS = [
	'ngOnInit',
	'ngOnChanges',
	'ngDoCheck',
	'ngOnDestroy',
	'ngAfterContentInit',
	'ngAfterContentChecked',
	'ngAfterViewInit',
	'ngAfterViewChecked',
	'writeValue',
	'registerOnChange',
	'registerOnTouched',
	'setDisabledState',
];

function hasNoJSDoc(member, typeChecker) {
	if (!member.symbol) {
		return true;
	}

	const jsDoc = displayPartsToHtml(member.symbol.getDocumentationComment(typeChecker));
	return jsDoc.trim().length === 0;
}

function isInternalMember(member) {
	if (member.jsDoc && member.jsDoc.length > 0) {
		for (let i = 0; i < member.jsDoc.length; i++) {
			if (member.jsDoc[i].tags && member.jsDoc[i].tags.length > 0) {
				for (let j = 0; j < member.jsDoc[i].tags.length; j++) {
					if (member.jsDoc[i].tags[j].tagName.text === 'internal') {
						return true;
					}
				}
			}
		}
	}

	return false;
}

function isDecoratorOfType(decorator: Decorator, types: string[]) {
	return (
		isCallExpression(decorator.expression) &&
		isIdentifier(decorator.expression.expression) &&
		types.includes(decorator.expression.expression.text)
	);
}

function getDecoratorOfType(node: Node, decoratorType: string): Decorator | undefined {
	const decorators = canHaveDecorators(node) ? getDecorators(node) || [] : [];
	return decorators.find((decorator) => isDecoratorOfType(decorator, [decoratorType]));
}

function unquoteName(name: string) {
	return name.replace(/^['"]|['"]$/g, '');
}

function isAngularLifecycleHook(methodName) {
	return ANGULAR_LIFECYCLE_METHODS.includes(methodName);
}

function isPrivate(member) {
	return (getCombinedModifierFlags(member) & ModifierFlags.Private) !== 0;
}

function getJsDocTags(symbol: Symbol): {
	deprecated?: { version: string; description: string };
	since?: { version: string; description: string };
} {
	return !symbol
		? {}
		: symbol
				.getJsDocTags()
				.filter((el) => ['deprecated', 'since'].includes(el.name))
				.reduce((obj, el) => {
					const [version, ...rest] = el.text[0].text.split(' ');
					obj[el.name] = { version, description: rest.join(' ').trim() };
					return obj;
				}, {});
}

class APIDocVisitor {
	private readonly program: Program;
	private readonly typeChecker: TypeChecker;

	constructor(fileNames: string[]) {
		this.program = createProgram(fileNames, { lib: ['lib.es6.d.ts'] });
		this.typeChecker = this.program.getTypeChecker();
	}

	visitSourceFile(fileName: string) {
		const sourceFile = this.program.getSourceFile(fileName);

		if (!sourceFile) {
			throw new Error(`File doesn't exist: ${fileName}.`);
		}

		return sourceFile.statements.reduce((directivesSoFar, statement) => {
			if (isClassDeclaration(statement)) {
				return directivesSoFar.concat(this.visitClassDeclaration(fileName, statement));
			} else if (isInterfaceDeclaration(statement)) {
				return directivesSoFar.concat(this.visitInterfaceDeclaration(fileName, statement));
			}

			return directivesSoFar;
		}, []);
	}

	visitInterfaceDeclaration(fileName: string, interfaceDeclaration: InterfaceDeclaration) {
		const symbol = this.typeChecker.getSymbolAtLocation(interfaceDeclaration.name);
		const description = displayPartsToHtml(symbol.getDocumentationComment(this.typeChecker));
		const { deprecated, since } = getJsDocTags(symbol);
		const className = interfaceDeclaration.name.text;
		const members = this.visitMembers(interfaceDeclaration.members);

		return [
			{
				fileName,
				className,
				description,
				deprecated,
				since,
				type: 'Interface',
				methods: members.methods,
				properties: members.properties,
			},
		];
	}

	visitClassDeclaration(fileName: string, classDeclaration: ClassDeclaration) {
		const symbol = this.typeChecker.getSymbolAtLocation(classDeclaration.name);
		const description = displayPartsToHtml(symbol.getDocumentationComment(this.typeChecker));
		const { deprecated, since } = getJsDocTags(symbol);
		const className = classDeclaration.name.text;
		const decorators = getDecorators(classDeclaration);
		let directiveInfo;
		let members;

		// If there is no top documentation comment, consider it private, we skip it.
		if (!description) {
			return [];
		}

		if (decorators) {
			for (const decorator of decorators) {
				// COMPONENT / DIRECTIVE
				if (isDecoratorOfType(decorator, ['Directive', 'Component'])) {
					directiveInfo = this.visitDirectiveDecorator(decorator);
					members = this.visitMembers(classDeclaration.members);

					return [
						{
							fileName,
							className,
							description,
							deprecated,
							since,
							type: directiveInfo.type,
							selector: directiveInfo.selector,
							exportAs: directiveInfo.exportAs,
							inputs: members.inputs,
							outputs: members.outputs,
							properties: members.properties,
							methods: members.methods,
						},
					];
				}
				// SERVICE
				else if (isDecoratorOfType(decorator, ['Injectable'])) {
					members = this.visitMembers(classDeclaration.members);

					return [
						{
							fileName,
							className,
							description,
							deprecated,
							since,
							type: 'Service',
							methods: members.methods,
							properties: members.properties,
						},
					];
				}
			}
		}
		// CLASS
		else if (description) {
			members = this.visitMembers(classDeclaration.members);

			return [
				{
					fileName,
					className,
					description,
					deprecated,
					since,
					type: 'Class',
					methods: members.methods,
					properties: members.properties,
				},
			];
		}

		// a class that is not a directive or a service, not documented for now
		return [];
	}

	// @Directive({ selector: 'my-directive', exportAs: 'myDirective' })
	// @Component({ selector: 'my-component', exportAs: 'myComponent' })
	visitDirectiveDecorator(decorator: Decorator) {
		let result: { type: string; selector?: string; exportAs?: string };

		if (isCallExpression(decorator.expression)) {
			if (isIdentifier(decorator.expression.expression)) {
				result = {
					type: decorator.expression.expression.getText(),
				};

				const objectLiteral = decorator.expression.arguments[0];

				if (isObjectLiteralExpression(objectLiteral)) {
					for (const item of objectLiteral.properties) {
						if (isPropertyAssignment(item)) {
							const propertyName = item.name.getText();
							if (['selector', 'exportAs'].includes(propertyName)) {
								result[propertyName] = item.initializer.getText();
							}
						}
					}
				}
			}
		}

		return result;
	}

	visitMembers(members: NodeArray<TypeElement | ClassElement>) {
		const inputs = [];
		const outputs = [];
		const methods = [];
		const properties = [];

		for (const member of members) {
			// skipping private and internal
			if (isPrivate(member) || isInternalMember(member)) {
				continue;
			}

			// Release info tags
			const symbol = this.typeChecker.getSymbolAtLocation(member.name);
			const { deprecated, since } = getJsDocTags(symbol);
			const releaseInfo = { deprecated, since };

			const inputDecorator = getDecoratorOfType(member, 'Input');
			const outputDecorator = getDecoratorOfType(member, 'Output');

			// Input accessor or property
			if (inputDecorator) {
				if (isPropertyDeclaration(member)) {
					inputs.push({ ...this.visitInputProperty(member, inputDecorator), ...releaseInfo });
				} else if (isSetAccessorDeclaration(member)) {
					inputs.push({ ...this.visitInputOrOutputDeclaration(member, inputDecorator), ...releaseInfo });
				}
			}

			// Output
			else if (isPropertyDeclaration(member) && outputDecorator) {
				outputs.push({ ...this.visitInputOrOutputDeclaration(member, outputDecorator), ...releaseInfo });
			}

			// Method
			else if (
				(isMethodDeclaration(member) || isMethodSignature(member)) &&
				!isAngularLifecycleHook(member.name.getText()) &&
				!hasNoJSDoc(member, this.typeChecker)
			) {
				methods.push({ ...this.visitMethod(member), ...releaseInfo });
			}

			// Property
			else if (isPropertyDeclaration(member) || isPropertySignature(member)) {
				properties.push({ ...this.visitProperty(member), ...releaseInfo });
			}

			// Accessor
			else if (isGetAccessor(member)) {
				properties.push({ ...this.visitNamedDeclaration(member), ...releaseInfo });
			}
		}

		inputs.sort(NAMED_COMPARE);
		outputs.sort(NAMED_COMPARE);
		properties.sort(NAMED_COMPARE);

		return { inputs, outputs, methods, properties };
	}

	visitMethod(method: MethodDeclaration | MethodSignature) {
		return {
			...this.visitNamedDeclaration(method),
			args: method.parameters ? method.parameters.map((prop) => this.visitNamedDeclaration(prop)) : [],
			returnType: this.visitType(method.type),
		};
	}

	visitInputOrOutputDeclaration(declaration: NamedDeclaration, decorator: Decorator) {
		const args = isCallExpression(decorator.expression) ? decorator.expression.arguments : ([] as Expression[]);
		return {
			...this.visitNamedDeclaration(declaration),
			name: args.length ? unquoteName(args[0].getText()) : declaration.name.getText(),
		};
	}

	visitInputProperty(property: PropertyDeclaration, decorator: Decorator) {
		return {
			...this.visitInputOrOutputDeclaration(property, decorator),
			defaultValue: property.initializer?.getText(),
		};
	}

	visitNamedDeclaration(declaration: NamedDeclaration) {
		const symbol = this.typeChecker.getSymbolAtLocation(declaration.name);
		return {
			name: declaration.name.getText(),
			type: this.visitType(declaration),
			description: displayPartsToHtml(symbol.getDocumentationComment(this.typeChecker)),
		};
	}

	visitProperty(property: PropertyDeclaration | PropertySignature) {
		return {
			...this.visitNamedDeclaration(property),
			defaultValue: property.initializer?.getText(),
		};
	}

	visitType(node: Node & { type? }) {
		if (node && node.type) {
			return node.type.getText();
		}

		return node ? this.typeChecker.typeToString(this.typeChecker.getTypeAtLocation(node)) : 'void';
	}
}

export function parseOutApiDocs(programFiles: string[]): any {
	const apiDocVisitor = new APIDocVisitor(programFiles);

	return programFiles.reduce((soFar, file) => {
		const directivesInFile = apiDocVisitor.visitSourceFile(file);

		directivesInFile.forEach((directive) => {
			soFar[directive.className] = directive;
		});

		return soFar;
	}, {});
}
