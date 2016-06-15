import {Component, Directive} from '@angular/core';

/**
 * Foo doc
 */
@Directive({
  selector: '[foo]',
  exportAs: 'foo'
})
export class Foo {
}

/**
 * Bar doc
 */
@Component({
  selector: 'bar',
  template: `
        <span>bar</span>
    `
})
export class Bar {
}
