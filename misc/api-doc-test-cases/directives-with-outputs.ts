import {Directive, Output, EventEmitter} from '@angular/core';

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
