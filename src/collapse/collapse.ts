import {Directive, Input, Renderer2, ElementRef, Output, EventEmitter} from '@angular/core';
import {NgbRunTransition} from '../util/transition/ngbTransition';
import {NgbCollapsingTransition} from '../util/transition/ngbCollapseTransition';
import {NgbConfig} from '../ngb-config';

/**
 * A directive to provide a simple way of hiding and showing elements on the page.
 */
@Directive({
  selector: '[ngbCollapse]',
  exportAs: 'ngbCollapse',
  host: {'[class.collapse]': 'true', '[class.show]': '!collapsed'}
})
export class NgbCollapse {
  /**
   * If `true`, will collapse the element or show it otherwise.
   */
  @Input('ngbCollapse') collapsed = false;

  /**
   * A flag to enable/disable the animation
   */
  @Input() animation = false;

  @Output() ngbCollapseChange = new EventEmitter<boolean>();

  constructor(_renderer: Renderer2, private _element: ElementRef, ngbConfig: NgbConfig) {
    this.animation = ngbConfig.animation;
  }

  toggle(open: boolean = this.collapsed) {
    this.collapsed = !open;
    this.ngbCollapseChange.next(this.collapsed);
    NgbRunTransition(
        this._element.nativeElement, NgbCollapsingTransition,
        {animation: this.animation, data: {direction: open ? 'show' : 'hide'}});
  }
}
