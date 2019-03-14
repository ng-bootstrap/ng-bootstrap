import {parseDemo} from './parse-demo';

describe(`Parse demo for StackBlitz`, () => {

  it('should extract module name an component selector', () => {
    expect(parseDemo('./misc/parse-demo-test-cases/simple'))
        .toEqual({bootstrapComponentSelector: 'test-component', moduleClassName: 'TestModule'});
  });

  it('should extract module name an component selector (strange formatting)', () => {
    expect(parseDemo('./misc/parse-demo-test-cases/syntax'))
        .toEqual({bootstrapComponentSelector: 'test-component', moduleClassName: 'TestModule'});
  });

  it('should fail if there is no module', () => {
    expect(() => {
      parseDemo('./misc/parse-demo-test-cases/no-module');
    }).toThrowError(`Couldn't find any NgModules in ./misc/parse-demo-test-cases/no-module`);
  });

  it('should fail if there is no bootstrap component', () => {
    expect(() => { parseDemo('./misc/parse-demo-test-cases/no-bootstrap-component'); })
        .toThrowError(
            `Couldn't find any bootstrap components in TestModule in ./misc/parse-demo-test-cases/no-bootstrap-component`);
  });

  it('should fail if there is no bootstrap component selector', () => {
    expect(() => { parseDemo('./misc/parse-demo-test-cases/no-component-selector'); })
        .toThrowError(
            `Couldn't get bootstrap component selector for component ` +
            `TestComponent in TestModule in ./misc/parse-demo-test-cases/no-component-selector`);
  });
});
