var expect = require('chai').expect;
var apiDoc = require('./api-doc');

describe('API doc extractor', function() {

  it('should return [] if there are no docs to extract',
     function() { expect(apiDoc(['./misc/api-doc-test-cases/no-docs.ts'])).to.be.empty; });

  it('should extract basic info from directives and components', function() {
    var docs = apiDoc(['./misc/api-doc-test-cases/directives-no-in-out.ts']);

    expect(Object.keys(docs)).to.have.lengthOf(2);

    expect(docs.Foo.fileName).to.equal('misc/api-doc-test-cases/directives-no-in-out.ts');
    expect(docs.Foo.className).to.equal('Foo');
    expect(docs.Foo.selector).to.equal('[foo]');
    expect(docs.Foo.description).to.equal('Foo doc');
    expect(docs.Foo.exportAs).to.equal('foo');

    expect(docs.Bar.fileName).to.equal('misc/api-doc-test-cases/directives-no-in-out.ts');
    expect(docs.Bar.className).to.equal('Bar');
    expect(docs.Bar.selector).to.equal('bar');
    expect(docs.Bar.exportAs).to.be.undefined;
    expect(docs.Bar.description).to.equal('Bar doc');
  });

  it('should extract inputs info', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-inputs.ts']).Foo.inputs;

    expect(inputDocs).to.have.lengthOf(3);

    expect(inputDocs[0].name).to.equal('bar');
    expect(inputDocs[0].defaultValue).to.be.undefined;
    expect(inputDocs[0].type).to.equal('string');
    expect(inputDocs[0].description).to.equal('Bar doc');

    expect(inputDocs[1].name).to.equal('baz');
    expect(inputDocs[1].defaultValue).to.be.undefined;
    expect(inputDocs[1].type).to.equal('string | boolean');
    expect(inputDocs[1].description).to.equal('');

    expect(inputDocs[2].name).to.equal('foo');
    expect(inputDocs[2].defaultValue).to.equal('5');
    expect(inputDocs[2].type).to.be.undefined;
    expect(inputDocs[2].description).to.equal('Has default value');
  });

  it('should extract inputs info from setters', function() {
    var inputDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-tricky-inputs.ts']).Foo.inputs;

    expect(inputDocs).to.have.lengthOf(3);

    expect(inputDocs[0].name).to.equal('bar');
    expect(inputDocs[1].name).to.equal('baz');
    expect(inputDocs[2].name).to.equal('foo');
  });

  it('should extract outputs info', function() {
    var outDocs = apiDoc(['./misc/api-doc-test-cases/directives-with-outputs.ts']).Foo.outputs;

    expect(outDocs).to.have.lengthOf(2);

    expect(outDocs[0].name).to.equal('myEvent');
    expect(outDocs[0].description).to.equal('Desc');

    expect(outDocs[1].name).to.equal('myMappedEvent');
  });

});

// TODO: extract types for setters
// TODO: other members (we are only interested in public, non-lifecycle members)
