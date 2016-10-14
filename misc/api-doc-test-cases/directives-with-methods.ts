import {Directive, Input, OnInit} from '@angular/core';

/**
 * Foo doc
 */
@Directive({
  selector: '[foo]',
  exportAs: 'foo'
})
export class Foo implements OnInit {
  @Input() notMethod;

  constructor() {
  }

  /**
   * Use this one to produce foo!
   */
  fooMethod(arg1: string, arg2, arg3 = 1) {
  }

  ngOnInit() {
  }

  private _dontSerialize() {
  }

  noCommentDontExtract() {
  }
}
