import {Directive, Input} from '@angular/core';

/**
 * Foo doc
 */
@Directive({
  selector: '[foo]'
})
export class Foo {
  /**
   * Setter with default value from JSDoc
   *
   * @defaultValue `true`
   */
  @Input() set withDefaultValue(value: boolean) {
  }

  /**
   * Setter without default value
   */
  @Input() set withoutDefaultValue(value: string) {
  }

  /**
   * Property with initializer
   */
  @Input() propertyWithInitializer = false;

  /**
   * Property with both initializer and JSDoc default value
   *
   * @defaultValue `'from-jsdoc'`
   */
  @Input() propertyWithBoth = 'from-initializer';
}
