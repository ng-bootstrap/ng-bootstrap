import {Directive, Input} from '@angular/core';

/**
 * Foo doc
 */
@Directive({
  selector: '[foo]'
})
export class Foo {

  /**
   * Has default value
   */
  @Input() foo = 5;

  /**
   * Bar doc
   */
  @Input() bar: string;

  @Input() baz: string | boolean;

  notAnInput;

  set notAnInputEither(val) {
  }

  regularMethod() {
  }
}
