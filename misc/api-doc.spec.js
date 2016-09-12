var apiDoc = require('./api-doc');

describe('APIDocVisitor', function() {

  it('should return [] if there are no docs to extract',
     function() { expect(apiDoc(['./misc/api-doc-test-cases/no-docs.ts'])).toEqual({}); });

  it('should extract basic info from directives and components', function() {
    var docs = apiDoc(['misc/api-doc-test-cases/directives-no-in-out.ts']);

    expect(Object.keys(docs).length).toBe(2);

    expect(docs.Foo.fileName).toBe('misc/api-doc-test-cases/directives-no-in-out.ts');
    expect(docs.Foo.className).toBe('Foo');
    expect(docs.Foo.selector).toBe('[foo]');
    expect(docs.Foo.description).toBe('Foo doc');
    expect(docs.Foo.exportAs).toBe('foo');

    expect(docs.Bar.fileName).toBe('misc/api-doc-test-cases/directives-no-in-out.ts');
    expect(docs.Bar.className).toBe('Bar');
    expect(docs.Bar.selector).toBe('bar');
    expect(docs.Bar.exportAs).toBeUndefined();
    expect(docs.Bar.description).toBe('Bar doc');
  });

  it('should extract inputs info', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs.ts']).Foo.inputs;

    expect(inputDocs.length).toBe(3);

    expect(inputDocs[0].name).toBe('bar');
    expect(inputDocs[0].defaultValue).toBeUndefined();
    expect(inputDocs[0].type).toBe('string');
    expect(inputDocs[0].description).toBe('Bar doc');

    expect(inputDocs[1].name).toBe('baz');
    expect(inputDocs[1].defaultValue).toBeUndefined();
    expect(inputDocs[1].type).toBe('string | boolean');
    expect(inputDocs[1].description).toBe('');

    expect(inputDocs[2].name).toBe('foo');
    expect(inputDocs[2].defaultValue).toBe('5');
    expect(inputDocs[2].type).toBe('number');
    expect(inputDocs[2].description).toBe('Has default value');
  });

  it('should extract input default value', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs-default-vals.ts']).Foo.inputs;

    expect(inputDocs.length).toBe(3);

    expect(inputDocs[0].defaultValue).toBe('false');
    expect(inputDocs[1].defaultValue).toBe('5');
    expect(inputDocs[2].defaultValue).toBe('bar');
  });

  it('should extract inferred types', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs-types-to-infer.ts']).Foo.inputs;

    expect(inputDocs.length).toBe(3);

    expect(inputDocs[0].defaultValue).toBe('false');
    expect(inputDocs[0].type).toBe('boolean');
    expect(inputDocs[1].defaultValue).toBe('5');
    expect(inputDocs[1].type).toBe('number');
    expect(inputDocs[2].defaultValue).toBe('bar');
    expect(inputDocs[2].type).toBe('string');
  });

  it('should extract inputs info from setters', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-tricky-inputs.ts']).Foo.inputs;

    expect(inputDocs.length).toBe(3);

    expect(inputDocs[0].name).toBe('bar');
    expect(inputDocs[1].name).toBe('baz');
    expect(inputDocs[2].name).toBe('foo');
  });

  it('should extract outputs info', function() {
    var outDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-outputs.ts']).Foo.outputs;

    expect(outDocs.length).toBe(2);

    expect(outDocs[0].name).toBe('myEvent');
    expect(outDocs[0].description).toBe('Desc');

    expect(outDocs[1].name).toBe('myMappedEvent');
  });

  it('should extract public methods info', function() {
    var methodDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-methods.ts']).Foo.methods;

    expect(methodDocs.length).toBe(1);
    expect(methodDocs[0].name).toBe('fooMethod');
    expect(methodDocs[0].description).toBe('Use this one to produce foo!');
    expect(methodDocs[0].args.length).toBe(3);
    expect(methodDocs[0].args[0].name).toBe('arg1');
    expect(methodDocs[0].args[0].type).toBe('string');
    expect(methodDocs[0].args[1].name).toBe('arg2');
    expect(methodDocs[0].args[1].type).toBe('any');
    expect(methodDocs[0].args[2].name).toBe('arg3');
    expect(methodDocs[0].args[2].type).toBe('number');
  });

  it('should not extract public methods info when annotated with @internal', function() {
    var methodDocs = apiDoc(['./misc/api-doc-test-cases/component-with-internal-methods.ts']).Foo.methods;

    expect(methodDocs.length).toBe(0);
  });

  it('should extract documentation from services', function() {
    var serviceDocs =
        apiDoc(['./misc/api-doc-test-cases/services-with-methods.ts', './typings/index.d.ts']).ModalService;

    expect(serviceDocs.fileName).toBe('./misc/api-doc-test-cases/services-with-methods.ts');
    expect(serviceDocs.className).toBe('ModalService');
    expect(serviceDocs.description).toBe('A service to open modals');
    expect(serviceDocs.methods.length).toBe(2);

    expect(serviceDocs.methods[0].name).toBe('open');
    expect(serviceDocs.methods[0].description).toBe('A method to open a modal');
    expect(serviceDocs.methods[0].args.length).toBe(2);
    expect(serviceDocs.methods[0].returnType).toBe('Promise<any>');

    expect(serviceDocs.methods[1].name).toBe('isOpen');
    expect(serviceDocs.methods[1].description).toBe('');
    expect(serviceDocs.methods[1].args.length).toBe(0);
    expect(serviceDocs.methods[1].returnType).toBe('boolean');
  });

  it('should extract documentation of properties from services', function() {
    var serviceDocs = apiDoc(['./misc/api-doc-test-cases/services-with-properties.ts']).ProgressbarConfig;

    expect(serviceDocs.properties.length).toBe(2);
    expect(serviceDocs.properties[0].name).toBe('foo');
    expect(serviceDocs.properties[0].description).toBe('Voluntarily left without a default value.');
    expect(serviceDocs.properties[0].type).toBe('string');
    expect(serviceDocs.properties[0].defaultValue).toBeUndefined();

    expect(serviceDocs.properties[1].name).toBe('max');
    expect(serviceDocs.properties[1].description).toBe('Maximal value to be displayed in the progressbar.');
    expect(serviceDocs.properties[1].type).toBe('number');
    expect(serviceDocs.properties[1].defaultValue).toBe('100');
  });

  it('should extract documentation from interfaces', function() {
    var interfaceDocs = apiDoc(['./misc/api-doc-test-cases/interface-with-properties.ts']).NgbModalOptions;

    expect(interfaceDocs.className).toBe('NgbModalOptions');
    expect(interfaceDocs.description).toBe('Represent options available when opening new modal windows.');
    expect(interfaceDocs.properties.length).toBe(3);

    expect(interfaceDocs.properties[0].name).toBe('backdrop');
    expect(interfaceDocs.properties[0].description)
        .toContain('Weather a backdrop element should be created for a given modal (true by default)');
    expect(interfaceDocs.properties[0].description)
        .toContain("Alternatively, specify 'static' for a backdrop which doesn't close the modal on click.");
    expect(interfaceDocs.properties[0].type).toBe('boolean | "static"');
    expect(interfaceDocs.properties[0].defaultValue).toBeUndefined();

    expect(interfaceDocs.properties[1].name).toBe('keyboard');
    expect(interfaceDocs.properties[1].description)
        .toBe('Weather to close the modal when escape key is pressed (true by default).');
    expect(interfaceDocs.properties[1].type).toBe('boolean');
    expect(interfaceDocs.properties[1].defaultValue).toBeUndefined();

    expect(interfaceDocs.properties[2].name).toBe('size');
    expect(interfaceDocs.properties[2].description).toBe('Size of a new modal window.');
    expect(interfaceDocs.properties[2].type).toBe('"sm" | "lg"');
    expect(interfaceDocs.properties[2].defaultValue).toBeUndefined();
  });

  it('should extract method documentation from interfaces', function() {
    var interfaceDocs = apiDoc(['./misc/api-doc-test-cases/interface-with-methods.ts']).SomeInterface;

    expect(interfaceDocs.className).toBe('SomeInterface');
    expect(interfaceDocs.description).toBe('Some interface');
    expect(interfaceDocs.methods.length).toBe(1);

    expect(interfaceDocs.methods[0].name).toBe('foo');
    expect(interfaceDocs.methods[0].description).toContain('does something');
    expect(interfaceDocs.methods[0].returnType).toBe('void');
  });

  it('should extract documentation from documented classes', function() {
    var classDocs = apiDoc(['./misc/api-doc-test-cases/class-with-doc.ts']).DocumentedFoo;

    expect(classDocs.className).toBe('DocumentedFoo');
    expect(classDocs.description).toBe('This is a documented foo');

    expect(classDocs.properties[0].name).toBe('bar');
    expect(classDocs.properties[0].description).toContain('the bar');
    expect(classDocs.properties[0].type).toBe('string');

    expect(classDocs.methods.length).toBe(1);

    expect(classDocs.methods[0].name).toBe('someMethod');
    expect(classDocs.methods[0].description).toContain('some method');
    expect(classDocs.methods[0].returnType).toBe('void');
  });

});
