import {parseDemo} from './parse-demo';

describe(`Parse demo for StackBlitz`, () => {

  it('should extract a module name and a component selector', () => {
    expect(parseDemo('./misc/parse-demo-test-cases/simple/**/*.ts')).toEqual(new Map([[
      'misc/parse-demo-test-cases/simple/test.module.ts',
      {bootstrapComponentSelector: 'test-component', moduleClassName: 'TestModule'}
    ]]));
  });

  it('should extract multiple module names and component selectors', () => {
    expect(parseDemo('./misc/parse-demo-test-cases/multiple/**/*.ts')).toEqual(new Map([
      [
        'misc/parse-demo-test-cases/multiple/one/test.module.ts',
        {bootstrapComponentSelector: 'test-component1', moduleClassName: 'TestModule1'}
      ],
      [
        'misc/parse-demo-test-cases/multiple/two/test.module.ts',
        {bootstrapComponentSelector: 'test-component2', moduleClassName: 'TestModule2'}
      ]
    ]));
  });

  it('should extract module name and component selector (strange formatting)', () => {
    expect(parseDemo('./misc/parse-demo-test-cases/syntax/**/*.ts')).toEqual(new Map([[
      'misc/parse-demo-test-cases/syntax/test.module.ts',
      {bootstrapComponentSelector: 'test-component', moduleClassName: 'TestModule'}
    ]]));
  });

  it('should fail if there is no module', () => {
    expect(() => {
      parseDemo('./misc/parse-demo-test-cases/no-module/**/*.ts');
    }).toThrowError(`Couldn't find any NgModules in ./misc/parse-demo-test-cases/no-module/**/*.ts`);
  });

  it('should fail if there is no bootstrap component', () => {
    expect(() => { parseDemo('./misc/parse-demo-test-cases/no-bootstrap-component/**/*.ts'); })
        .toThrowError(
            `Couldn't find any bootstrap components in TestModule in misc/parse-demo-test-cases/no-bootstrap-component/test.module.ts`);
  });

  it('should fail if there is no bootstrap component selector', () => {
    expect(() => {
      parseDemo('./misc/parse-demo-test-cases/no-component-selector/**/*.ts');
    }).toThrowError(`Couldn't get bootstrap component selector for component TestComponent`);
  });
});
