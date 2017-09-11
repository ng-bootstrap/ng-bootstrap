import {Component, Input} from '@angular/core';
import {animate, animation, state, style, trigger, transition, useAnimation} from '@angular/animations';


const collapseAnimation =
    animation([style({height: '{{from}}', overflow: 'hidden'}), animate('0.95s ease', style({height: '{{to}}'}))]);

/**
 * The NgbCollapse component provides a simple way to hide and show an element with animations.
 */
@Component({
  selector: '[ngbCollapse]',
  exportAs: 'ngbCollapse',
  host: {'[@collapse]': 'collapsed ? "collapsed" : "expanded"'},
  template: '<ng-content></ng-content>',
  animations: [trigger(
      'collapse',
      [
        state('collapsed', style({display: 'none'})),
        transition('collapsed => expanded', [useAnimation(collapseAnimation, {params: {from: '0', to: '*'}})]),
        transition('expanded => collapsed', [useAnimation(collapseAnimation, {params: {from: '*', to: '0'}})]),
      ])]
})
export class NgbCollapse {
  /**
   * A flag indicating collapsed (true) or open (false) state.
   */
  @Input('ngbCollapse') collapsed = false;
}
