import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[foo]'
})
export class Foo {

  @Input() fooBoolean = false;
  @Input() fooNumber = 5;
  @Input() fooString = 'bar';
}
