import {Directive, Input} from '@angular/core';

/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
@Directive({
  selector: '[ngbCollapse]',
  exportAs: 'ngbCollapse',
  host: {'[class.collapse]': 'true', '[class.in]': '!collapsed', '[attr.aria-expanded]': '!collapsed'}
})
export class NgbCollapse {
  /**
   * A flag indicating collapsed (true) or open (false) state.
   */
  @Input('ngbCollapse') collapsed = false;
}

export const NGB_COLLAPSE_DIRECTIVES = [NgbCollapse];
