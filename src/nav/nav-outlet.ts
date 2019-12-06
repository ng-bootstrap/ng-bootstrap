import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgbNavDirective} from './nav';

/**
 * The outlet for the nav
 */
@Component({
  selector: '[ngbNavOutlet]',
  host: {class: 'nav-content'},
  encapsulation: ViewEncapsulation.None,
  template: `
      <ng-template ngFor let-item [ngForOf]="nav.items">
          <div
                  class="nav-pane tab-pane {{item.isActive() ? 'active' : null}}"
                  *ngIf="item.isPanelInDom()"
                  role="tabpanel"
                  [attr.aria-labelledby]="item.getDomId()" [id]="item.getPanelDomId()">
              <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef"></ng-template>
          </div>
      </ng-template>
  `
})
export class NgbNavOutlet {
  @Input('ngbNavOutlet') nav: NgbNavDirective;
}
