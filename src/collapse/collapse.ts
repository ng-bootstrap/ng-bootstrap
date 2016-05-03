import {Directive, Input} from '@angular/core';

@Directive({
  selector: '[ngbCollapse]',
  exportAs: 'ngbCollapse',
  host: {'[class.collapse]': 'true', '[class.in]': '!collapsed', '[attr.aria-expanded]': '!collapsed'}
})
export class NgbCollapse {
  @Input('ngbCollapse') collapsed: boolean;
}
