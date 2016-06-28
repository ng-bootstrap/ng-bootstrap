var apiDoc = require('./api-doc');

describe('APIDocVisitor', function() {

  it('should return [] if there are no docs to extract',
     function() { expect(apiDoc(['./misc/api-doc-test-cases/no-docs.ts'])).toEqual({}); });

  it('should extract basic info from directives and components', function() {
    var docs = apiDoc(['./misc/api-doc-test-cases/directives-no-in-out.ts']);

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

});

// TODO: extract types for setters
// TODO: other members (we are only interested in public, non-lifecycle members)
