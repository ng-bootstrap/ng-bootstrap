import { parseOutApiDocs as apiDoc } from './api-doc';
import { describe, it } from 'node:test';
import assert from 'node:assert';

describe('APIDocVisitor', () => {
	it('should return [] if there are no docs to extract', () => {
		assert.deepStrictEqual(apiDoc(['./misc/api-doc-test-cases/no-docs.ts']), {});
	});

	it('should extract basic info from directives and components', () => {
		const docs = apiDoc(['misc/api-doc-test-cases/directives-no-in-out.ts']);

		assert.strictEqual(Object.keys(docs).length, 2);

		assert.strictEqual(docs.Foo.fileName, 'misc/api-doc-test-cases/directives-no-in-out.ts');
		assert.strictEqual(docs.Foo.className, 'Foo');
		assert.strictEqual(docs.Foo.selector, `'[foo]'`);
		assert.strictEqual(docs.Foo.description, '<p>Foo doc</p>');
		assert.strictEqual(docs.Foo.exportAs, `'foo'`);

		assert.strictEqual(docs.Bar.fileName, 'misc/api-doc-test-cases/directives-no-in-out.ts');
		assert.strictEqual(docs.Bar.className, 'Bar');
		assert.strictEqual(docs.Bar.selector, `'bar'`);
		assert.strictEqual(docs.Bar.exportAs, undefined);
		assert.strictEqual(docs.Bar.description, '<p>Bar doc</p>');
	});

	it('should extract basic type info from classes', () => {
		const docs = apiDoc(['misc/api-doc-test-cases/types.ts']);

		assert.strictEqual(Object.keys(docs).length, 5);

		assert.strictEqual(docs.NgbDirective.type, 'Directive');
		assert.strictEqual(docs.NgbComponent.type, 'Component');
		assert.strictEqual(docs.NgbService.type, 'Service');
		assert.strictEqual(docs.NgbClass.type, 'Class');
		assert.strictEqual(docs.NgbInterface.type, 'Interface');
	});

	it('should extract inputs info', () => {
		const inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs.ts']).Foo.inputs;

		assert.strictEqual(inputDocs.length, 6);

		assert.strictEqual(inputDocs[0].name, 'bar');
		assert.strictEqual(inputDocs[0].defaultValue, undefined);
		assert.strictEqual(inputDocs[0].type, 'string');
		assert.strictEqual(inputDocs[0].description, '<p>Bar doc</p>');

		assert.strictEqual(inputDocs[1].name, 'baz');
		assert.strictEqual(inputDocs[1].defaultValue, undefined);
		assert.strictEqual(inputDocs[1].type, 'string | boolean');
		assert.strictEqual(inputDocs[1].description, '');

		assert.strictEqual(inputDocs[2].name, 'foo');
		assert.strictEqual(inputDocs[2].defaultValue, '5');
		assert.strictEqual(inputDocs[2].type, 'number');
		assert.strictEqual(inputDocs[2].description, '<p>Has default value</p>');

		assert.strictEqual(inputDocs[3].name, 'ngbAliased1');
		assert.strictEqual(inputDocs[3].type, 'string');

		assert.strictEqual(inputDocs[4].name, 'ngbAliased2');
		assert.strictEqual(inputDocs[4].type, 'string');

		assert.strictEqual(inputDocs[5].name, 'required');
		assert.strictEqual(inputDocs[5].type, 'string');
	});

	it('should extract input default value', () => {
		const inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs-default-vals.ts']).Foo.inputs;

		assert.strictEqual(inputDocs.length, 3);

		assert.strictEqual(inputDocs[0].defaultValue, 'false');
		assert.strictEqual(inputDocs[1].defaultValue, '5');
		assert.strictEqual(inputDocs[2].defaultValue, `'bar'`);
	});

	it('should extract inferred types', () => {
		const inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs-types-to-infer.ts']).Foo.inputs;

		assert.strictEqual(inputDocs.length, 3);

		assert.strictEqual(inputDocs[0].defaultValue, 'false');
		assert.strictEqual(inputDocs[0].type, 'boolean');
		assert.strictEqual(inputDocs[1].defaultValue, '5');
		assert.strictEqual(inputDocs[1].type, 'number');
		assert.strictEqual(inputDocs[2].defaultValue, `'bar'`);
		assert.strictEqual(inputDocs[2].type, 'string');
	});

	it('should extract inputs info from setters', () => {
		const inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-tricky-inputs.ts']).Foo.inputs;

		assert.strictEqual(inputDocs.length, 3);

		assert.strictEqual(inputDocs[0].name, 'bar');
		assert.strictEqual(inputDocs[1].name, 'baz');
		assert.strictEqual(inputDocs[2].name, 'foo');
	});

	it('should extract outputs info', () => {
		const outDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-outputs.ts']).Foo.outputs;

		assert.strictEqual(outDocs.length, 2);

		assert.strictEqual(outDocs[0].name, 'myEvent');
		assert.strictEqual(outDocs[0].description, '<p>Desc</p>');

		assert.strictEqual(outDocs[1].name, 'myMappedEvent');
	});

	it('should extract public methods info', () => {
		const methodDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-methods.ts']).Foo.methods;

		assert.strictEqual(methodDocs.length, 1);
		assert.strictEqual(methodDocs[0].name, 'fooMethod');
		assert.strictEqual(methodDocs[0].description, '<p>Use this one to produce foo!</p>');
		assert.strictEqual(methodDocs[0].args.length, 3);
		assert.strictEqual(methodDocs[0].args[0].name, 'arg1');
		assert.strictEqual(methodDocs[0].args[0].type, 'string');
		assert.strictEqual(methodDocs[0].args[1].name, 'arg2');
		assert.strictEqual(methodDocs[0].args[1].type, 'any');
		assert.strictEqual(methodDocs[0].args[2].name, 'arg3');
		assert.strictEqual(methodDocs[0].args[2].type, 'number');
	});

	it('should not extract internal components, directives, services and interfaces', () => {
		const docs = apiDoc(['./misc/api-doc-test-cases/internal-things.ts']);

		assert.deepStrictEqual(docs, {});
	});

	it('should not extract public methods info when annotated with @internal', () => {
		const methodDocs = apiDoc(['./misc/api-doc-test-cases/component-with-internal-methods.ts']).Foo.methods;

		assert.strictEqual(methodDocs.length, 0);
	});

	it('should extract documentation from services', () => {
		const serviceDocs = apiDoc(['./misc/api-doc-test-cases/services-with-methods.ts']).ModalService;

		assert.strictEqual(serviceDocs.fileName, './misc/api-doc-test-cases/services-with-methods.ts');
		assert.strictEqual(serviceDocs.className, 'ModalService');
		assert.strictEqual(serviceDocs.description, '<p>A service to open modals</p>');
		assert.strictEqual(serviceDocs.methods.length, 2);

		assert.strictEqual(serviceDocs.methods[0].name, 'open');
		assert.strictEqual(serviceDocs.methods[0].description, '<p>A method to open a modal</p>');
		assert.strictEqual(serviceDocs.methods[0].args.length, 2);
		assert.strictEqual(serviceDocs.methods[0].returnType, 'Promise<any>');

		assert.strictEqual(serviceDocs.methods[1].name, 'isOpen');
		assert.strictEqual(serviceDocs.methods[1].description, '<p>Checks if a modal is open</p>');
		assert.strictEqual(serviceDocs.methods[1].args.length, 0);
		assert.strictEqual(serviceDocs.methods[1].returnType, 'boolean');
	});

	it('should extract documentation of properties from services', () => {
		const serviceDocs = apiDoc(['./misc/api-doc-test-cases/services-with-properties.ts']).ProgressbarConfig;

		assert.strictEqual(serviceDocs.properties.length, 3);

		assert.strictEqual(serviceDocs.properties[0].name, 'foo');
		assert.strictEqual(serviceDocs.properties[0].description, '<p>Voluntarily left without a default value.</p>');
		assert.strictEqual(serviceDocs.properties[0].type, 'string');
		assert.strictEqual(serviceDocs.properties[0].defaultValue, undefined);

		assert.strictEqual(serviceDocs.properties[1].name, 'max');
		assert.strictEqual(
			serviceDocs.properties[1].description,
			'<p>Maximal value to be displayed in the progressbar.</p>',
		);
		assert.strictEqual(serviceDocs.properties[1].type, 'number');
		assert.strictEqual(serviceDocs.properties[1].defaultValue, '100');

		assert.strictEqual(serviceDocs.properties[2].name, 'noDescriptionButStillExtract');
		assert.strictEqual(serviceDocs.properties[2].description, '');
		assert.strictEqual(serviceDocs.properties[2].type, 'string');
		assert.strictEqual(serviceDocs.properties[2].defaultValue, `'sth'`);
	});

	it('should extract documentation from interfaces', () => {
		const interfaceDocs = apiDoc(['./misc/api-doc-test-cases/interface-with-properties.ts']).NgbModalOptions;

		assert.strictEqual(interfaceDocs.className, 'NgbModalOptions');
		assert.strictEqual(interfaceDocs.description, '<p>Represent options available when opening new modal windows.</p>');
		assert.strictEqual(interfaceDocs.properties.length, 3);

		assert.strictEqual(interfaceDocs.properties[0].name, 'backdrop');
		assert.ok(
			interfaceDocs.properties[0].description.includes(
				'Weather a backdrop element should be created for a given modal (true by default).',
			),
		);
		assert.strictEqual(interfaceDocs.properties[0].type, `boolean | 'static'`);
		assert.strictEqual(interfaceDocs.properties[0].defaultValue, undefined);

		assert.strictEqual(interfaceDocs.properties[1].name, 'keyboard');
		assert.strictEqual(
			interfaceDocs.properties[1].description,
			'<p>Weather to close the modal when escape key is pressed (true by default).</p>',
		);
		assert.strictEqual(interfaceDocs.properties[1].type, 'boolean');
		assert.strictEqual(interfaceDocs.properties[1].defaultValue, undefined);

		assert.strictEqual(interfaceDocs.properties[2].name, 'size');
		assert.strictEqual(interfaceDocs.properties[2].description, '<p>Size of a new modal window.</p>');
		assert.strictEqual(interfaceDocs.properties[2].type, `'sm' | 'lg' | 'xl' | string`);
		assert.strictEqual(interfaceDocs.properties[2].defaultValue, undefined);
	});

	it('should extract method documentation from interfaces', () => {
		const interfaceDocs = apiDoc(['./misc/api-doc-test-cases/interface-with-methods.ts']).SomeInterface;

		assert.strictEqual(interfaceDocs.className, 'SomeInterface');
		assert.strictEqual(interfaceDocs.description, '<p>Some interface</p>');
		assert.strictEqual(interfaceDocs.methods.length, 1);

		assert.strictEqual(interfaceDocs.methods[0].name, 'foo');
		assert.ok(interfaceDocs.methods[0].description.includes('does something'));
		assert.strictEqual(interfaceDocs.methods[0].returnType, 'void');
	});

	it('should extract documentation from documented classes', () => {
		const classDocs = apiDoc(['./misc/api-doc-test-cases/class-with-doc.ts']).DocumentedFoo;

		assert.strictEqual(classDocs.className, 'DocumentedFoo');
		assert.strictEqual(classDocs.description, '<p>This is a documented foo</p>');

		assert.strictEqual(classDocs.properties.length, 2);

		assert.strictEqual(classDocs.properties[0].name, 'bar');
		assert.strictEqual(classDocs.properties[0].description, '<p>the bar</p>');
		assert.strictEqual(classDocs.properties[0].type, 'string');

		assert.strictEqual(classDocs.properties[1].name, 'componentInstance');
		assert.strictEqual(classDocs.properties[1].description, '<p>A getter</p>');
		assert.strictEqual(classDocs.properties[1].type, 'any');

		assert.strictEqual(classDocs.methods.length, 1);

		assert.strictEqual(classDocs.methods[0].name, 'someMethod');
		assert.strictEqual(classDocs.methods[0].description, '<p>some method</p>');
		assert.strictEqual(classDocs.methods[0].returnType, 'void');
	});

	it('should extract deprecation information', () => {
		const docs = apiDoc(['misc/api-doc-test-cases/release-deprecation.ts']);

		assert.deepStrictEqual(docs.NgbDirective.deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbComponent.deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbService.deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbClass.deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbInterface.deprecated, { version: '2.0.0', description: 'description' });

		assert.deepStrictEqual(docs.NgbDirective.inputs[0].deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbDirective.outputs[0].deprecated, { version: '2.0.0', description: 'description' });
		assert.deepStrictEqual(docs.NgbDirective.properties[0].deprecated, {
			version: '2.0.0',
			description: 'description',
		});
		assert.deepStrictEqual(docs.NgbDirective.methods[0].deprecated, { version: '2.0.0', description: 'description' });
	});

	it('should extract feature introduction information', () => {
		const docs = apiDoc(['misc/api-doc-test-cases/release-features.ts']);

		assert.deepStrictEqual(docs.NgbDirective.since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbComponent.since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbService.since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbClass.since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbInterface.since, { version: '2.0.0', description: '' });

		assert.deepStrictEqual(docs.NgbDirective.inputs[0].since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbDirective.outputs[0].since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbDirective.properties[0].since, { version: '2.0.0', description: '' });
		assert.deepStrictEqual(docs.NgbDirective.methods[0].since, { version: '2.0.0', description: '' });
	});
});
