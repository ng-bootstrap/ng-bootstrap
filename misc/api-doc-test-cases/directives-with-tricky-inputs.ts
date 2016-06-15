import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[foo]'
})
export class Foo {
  @Input('foo') _foo;
  @Input() set bar(newVal) {
  };
  @Input('baz') set _baz(newVal) {
  };
}
