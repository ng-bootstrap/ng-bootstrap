import {Directive, Input, ElementRef, Output, EventEmitter} from '@angular/core';
import {ngbRunTransition} from '../util/transition/ngbTransition';
import {ngbCollapsingTransition} from '../util/transition/ngbCollapseTransition';
import {NgbCollapseConfig} from './collapse-config';

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
   * If `true`, collapse will be animated.
   *
   * Animation is triggered only when clicked on triggering element
   * or via the `.toggle()` function
   */
  @Input() animation = false;

  /**
   * If `true`, will collapse the element or show it otherwise.
   */
  @Input('ngbCollapse') collapsed = false;

  @Output() ngbCollapseChange = new EventEmitter<boolean>();

  constructor(private _element: ElementRef, config: NgbCollapseConfig) { this.animation = config.animation; }

  /**
   * Triggers collapsing programmatically.
   *
   * If there is a collapsing transition running already, it will be reversed.
   * If the animations are turned off this happens synchronously.
   */
  toggle(open: boolean = this.collapsed) {
    this.collapsed = !open;
    ngbRunTransition(this._element.nativeElement, ngbCollapsingTransition, {
      animation: this.animation,
      runningTransition: 'stop',
      context: {direction: open ? 'show' : 'hide'}
    }).subscribe(() => this.ngbCollapseChange.next(this.collapsed));
  }
}
