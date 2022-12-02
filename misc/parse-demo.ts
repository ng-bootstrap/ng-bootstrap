import * as glob from 'glob';
import * as path from 'path';
import * as ts from 'typescript';
import * as fs from 'fs';

const SELECTOR_REGEX = new RegExp(/selector:[\s]*['"`]([^'"`]*)['"`]/m);
const TYPE_REGEX = new RegExp(/type:\s*([^,]*)/gi);

export interface DemoMetadata {
	componentName: string;
	demoName: string;
	className: string;
	fileName: string;
	selector: string;
	folder: string;
	files: string[];
}

export function parseDemos(demoFolderPath: string): DemoMetadata[] {
	const demos: DemoMetadata[] = [];

	const program = ts.createProgram(glob.sync(`${demoFolderPath}/**/*.ts`), {});
	program.getTypeChecker();

	function processRoutingFile(routingFile: string, demosPath: string) {
		const demoFolders = fs.readdirSync(demosPath);

		let parts = routingFile.split(path.sep);
		const componentName = parts[parts.length - 2];

		const knownDemoComponents = new Set<string>();

		// 1. Getting all known demo class names from the routes config
		program.getSourceFile(routingFile).forEachChild((node) => {
			if (node.kind === ts.SyntaxKind.VariableStatement && node.getText().includes('DEMOS')) {
				let matches = node.getText().matchAll(TYPE_REGEX);
				for (let match of matches) {
					knownDemoComponents.add(match[1]);
				}
			}
		});

		demoFolders.forEach((demoName) => {
			let demoFolder = path.join(demosPath, demoName);

			const demoFiles = glob.sync(`${demoFolder}/**/*.ts`);

			// 2. Getting all exising components from all the demo files and searching if the match known ones
			demoFiles.forEach((demoFile) => {
				const sourceFile = program.getSourceFile(demoFile);
				sourceFile.forEachChild((node) => {
					switch (node.kind) {
						case ts.SyntaxKind.ClassDeclaration:
							const classDeclaration = <ts.ClassDeclaration>node;
							const className = classDeclaration.name.getText();

							// 3. If we see that this class declaration is a known demo component, we extract its selector and filename
							if (knownDemoComponents.has(className)) {
								ts.getDecorators(classDeclaration).forEach((decorator) => {
									const textDecorator = decorator.getText();
									if (textDecorator.startsWith('@Component')) {
										const matches = SELECTOR_REGEX.exec(textDecorator);
										if (matches) {
											demos.push({
												componentName,
												demoName,
												className,
												selector: matches[1],
												fileName: path.basename(sourceFile.fileName),
												folder: demoFolder,
												files: glob.sync(`${demoFolder}/**/*.*`),
											});
										}
									}
								});
							}
					}
				});
			});
		});
	}

	const routingFiles = glob.sync(`${demoFolderPath}/**/*.routes.ts`);

	routingFiles.forEach((routingFile) =>
		processRoutingFile(routingFile, `${routingFile.substring(0, routingFile.lastIndexOf(path.sep) + 1)}demos`),
	);
	return demos;
}
