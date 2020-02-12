import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgbNav} from './nav';

/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
@Component({
  selector: '[ngbNavOutlet]',
  host: {'[class.tab-content]': 'true'},
  encapsulation: ViewEncapsulation.None,
  template: `
      <ng-template ngFor let-item [ngForOf]="nav.items">
          <div class="tab-pane"
               *ngIf="item.isPanelInDom()"
               [id]="item.panelDomId"
               [class.active]="item.active"
               [attr.role]="paneRole ? paneRole : nav.roles ? 'tabpanel' : undefined"
               [attr.aria-labelledby]="item.domId">
              <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef"
                           [ngTemplateOutletContext]="{$implicit: item.active}"></ng-template>
          </div>
      </ng-template>
  `
})
export class NgbNavOutlet {
  /**
   * A role to set on the nav pane
   */
  @Input() paneRole;

  /**
   * Reference to the `NgbNav`
   */
  @Input('ngbNavOutlet') nav: NgbNav;
}
