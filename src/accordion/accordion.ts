import {
  Component,
  forwardRef,
  Inject,
  Input,
  QueryList,
  ContentChildren,
  AfterContentChecked,
  Optional
} from '@angular/core';

import {NgbCollapse} from '../collapse/collapse';

let nextId = 0;

/**
 * The NgbPanel directive builds on top of the NgbCollapse directive to provide a panel with collapsible body that can
 * be collapsed or expanded by clicking on the panel's header.
 */
@Component({
  selector: 'ngb-panel',
  exportAs: 'ngbPanel',
  template: `
    <div class="panel panel-default" [class.panel-open]="open">
      <div class="panel-heading" role="tab" [id]="id">
        <h4 class="panel-title">
          <a tabindex="0" (click)="toggleOpen($event)"><span [class.text-muted]="disabled">{{title}}</span></a>
        </h4>
      </div>
      <div class="panel-collapse" [ngbCollapse]="!open" [attr.aria-labelledby]="id" role="tabpanel">
        <div class="panel-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  directives: [NgbCollapse]
})
export class NgbPanel {
  /**
   *  A flag determining whether the panel is disabled or not.
   *  When disabled, the panel cannot be toggled.
   */
  @Input() disabled = false;

  /**
   *  An optional id for the panel. The id should be unique.
   *  If not provided, it will be auto-generated.
   */
  @Input() id = `ngb-panel-${nextId++}`;

  /**
   *  Defines whether the panel should be open initially.
   */
  @Input() open = false;

  /**
   *  The title for the panel.
   */
  @Input() title: string;

  constructor(@Optional() @Inject(forwardRef(() => NgbAccordion)) private accordion: NgbAccordion) {}

  toggleOpen(event): void {
    event.preventDefault();
    if (!this.disabled) {
      this.open = !this.open;
      if (this.open && this.accordion) {
        this.accordion.closeOthers(this);
      }
    }
  }
}

/**
 * The NgbAccordion directive is a collection of panels.
 * NgbAccordion can assure that only one panel can be opened at a time.
 */
@Component({
  selector: 'ngb-accordion',
  host: {'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels'},
  template: `<ng-content></ng-content>`
})
export class NgbAccordion implements AfterContentChecked {
  @ContentChildren(NgbPanel) _panels: QueryList<NgbPanel>;

  /**
   *  A flag determining whether the other panels should be closed
   *  when a panel is opened.
   */
  @Input('closeOthers') closeOtherPanels: boolean;

  closeOthers(openPanel: NgbPanel): void {
    if (this.closeOtherPanels) {
      this._panels.forEach((panel: NgbPanel) => {
        if (panel !== openPanel) {
          panel.open = false;
        }
      });
    }
  }

  ngAfterContentChecked() {
    const openPanels = this._panels.toArray().filter((panel) => panel.open);
    if (openPanels.length > 1) {
      this.closeOthers(openPanels[0]);
    }
  }
}

export const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel];
