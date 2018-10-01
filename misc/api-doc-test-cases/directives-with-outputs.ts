import { Directive, EventEmitter, Output } from '@angular/core';

/**
 * Foo doc
 */
@Directive({
  selector: '[foo]'
})
export class Foo {

  /**
   * Desc
   */
  @Output() myEvent = new EventEmitter();

  @Output('myMappedEvent') _myMappedEvent = new EventEmitter();
}
