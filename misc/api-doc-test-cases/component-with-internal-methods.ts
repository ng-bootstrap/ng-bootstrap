import {Component, Input, OnInit} from '@angular/core';

/**
 * Foo doc
 */
@Component({
  selector: '[foo]',
  template: '<button (click)="forTemplateOnly()">{{buttonTxt}}</button>',
  exportAs: 'foo'
})
export class Foo implements OnInit {
  @Input() buttonTxt;

  constructor() {
  }

  /**
   * Only used in a template
   *
   * @internal
   */
  forTemplateOnly() {
    console.log('I was clicked!');
  }

  ngOnInit() {
  }
  
  private _dontSerialize() {
  }
}
