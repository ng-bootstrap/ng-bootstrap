import {Directive, Input} from '@angular/core';

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
}
