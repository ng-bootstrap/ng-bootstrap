import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[foo]'
})
export class Foo {

  @Input() fooBoolean: boolean = false;
  @Input() fooNumber: number = 5;
  @Input() fooString: string = 'bar';
}
