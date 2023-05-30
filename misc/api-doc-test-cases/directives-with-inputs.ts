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

  @Input('ngbAliased1') aliased1: string;

  @Input({ alias: 'ngbAliased2' }) aliased2: string;

  @Input({ required: true }) required: string;

  notAnInput;

  set notAnInputEither(val) {
  }

  regularMethod() {
  }
}
