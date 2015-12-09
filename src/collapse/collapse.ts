import {Directive, Input} from 'angular2/core';

@Directive({
  selector: '[ngb-collapse]',
  exportAs: 'ngbCollapse',
  host: {'class': 'collapse', '[class.in]': '!collapsed', '[attr.aria-expanded]': '!collapsed'}
})
export class NgbCollapse {
  @Input('ngbCollapse') collapsed: boolean;
}
