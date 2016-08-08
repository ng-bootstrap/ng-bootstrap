import {
  Component,
  Input,
  QueryList,
  ContentChildren,
  Directive,
  TemplateRef,
  ContentChild,
  Output,
  EventEmitter,
  AfterContentChecked
} from '@angular/core';
import {isString} from '../util/util';

let nextId = 0;

/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
@Directive({selector: 'template[ngbPanelTitle]'})
export class NgbPanelTitle {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * This directive must be used to wrap accordion panel content.
 */
@Directive({selector: 'template[ngbPanelContent]'})
export class NgbPanelContent {
  constructor(public templateRef: TemplateRef<any>) {}
}

/**
 * The NgbPanel directive represents an in individual panel with the title and collapsible
 * content
 */
@Directive({selector: 'ngb-panel'})
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
   *  The title for the panel.
   */
  @Input() title: string;

  /**
   *  Panel type (CSS class). Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;

  @ContentChild(NgbPanelContent) contentTpl: NgbPanelContent;
  @ContentChild(NgbPanelTitle) titleTpl: NgbPanelTitle;
}

/**
 * The payload of the panel change event
 */
export interface NgbPanelChangeEvent {
  panelId: string;
  nextState: boolean;
  preventDefault();
}

/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only panel can be opened at a time.
 */
@Component({
  selector: 'ngb-accordion',
  exportAs: 'ngbAccordion',
  template: `
  <div class="card">
    <template ngFor let-panel [ngForOf]="_panels">
      <div [class]="'card-header ' + (panel.type ? 'card-'+panel.type: type ? 'card-'+type : '')" [class.active]="_isOpen(panel.id)">
        <a tabindex="0" href (click)="!!toggle(panel.id)" [class.text-muted]="panel.disabled">
          {{panel.title}}<template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></template>          
        </a>
      </div>
      <div class="card-block" *ngIf="_isOpen(panel.id)">
        <template [ngTemplateOutlet]="panel.contentTpl.templateRef"></template>
      </div>
    </template>
  </div>
`
})
export class NgbAccordion implements AfterContentChecked {
  @ContentChildren(NgbPanel) _panels: QueryList<NgbPanel>;

  /**
   * An array or comma separated strings of panel identifiers that should be opened
   */
  @Input() activeIds: string | string[] = [];

  /**
   *  Whether the other panels should be closed when a panel is opened
   */
  @Input('closeOthers') closeOtherPanels = false;

  /**
   *  Type of accordion's panels. Bootstrap 4 recognizes the following types: "success", "info", "warning" and "danger".
   */
  @Input() type: string;


  /**
   * A panel change event fired right before the panel toggle happens. The event object has three properties:
   * 'panelId', the id of panel that id toggled, 'nextState' whether panel will be opened (true) or closed (false),
   * and a function, 'preventDefault()' which, when executed, will prevent the panel toggle from occurring.
   */
  @Output() change = new EventEmitter<NgbPanelChangeEvent>();

  /**
   * A map that stores each panel state
   */
  private _states: Map<string, boolean> = new Map<string, boolean>();

  /**
   * A map that stores references to all panels
   */
  private _panelRefs: Map<string, NgbPanel> = new Map<string, NgbPanel>();

  ngAfterContentChecked() {
    // active id updates
    if (isString(this.activeIds)) {
      this.activeIds = (this.activeIds as string).split(/\s*,\s*/);
    }
    this._updateStates();

    // closeOthers updates
    if (this.activeIds.length > 1 && this.closeOtherPanels) {
      this._closeOthers(this.activeIds[0]);
      this._updateActiveIds();
    }
  }

  toggle(panelId: string) {
    const panel = this._panelRefs.get(panelId);

    if (panel && !panel.disabled) {
      const nextState = !this._states.get(panelId);
      let defaultPrevented = false;

      this.change.emit({panelId: panelId, nextState: nextState, preventDefault: () => { defaultPrevented = true; }});

      if (!defaultPrevented) {
        this._states.set(panelId, nextState);

        if (this.closeOtherPanels) {
          this._closeOthers(panelId);
        }
        this._updateActiveIds();
      }
    }
  }

  private _closeOthers(panelId: string) {
    this._states.forEach((state, id) => {
      if (id !== panelId) {
        this._states.set(id, false);
      }
    });
  }

  private _isOpen(panelId: string): boolean { return this._states.get(panelId); }

  private _updateActiveIds() {
    this.activeIds =
        this._panels.toArray().filter(panel => this._isOpen(panel.id) && !panel.disabled).map(panel => panel.id);
  }

  private _updateStates() {
    this._states.clear();
    this._panelRefs.clear();
    this._panels.toArray().forEach((panel) => {
      this._states.set(panel.id, this.activeIds.indexOf(panel.id) > -1 && !panel.disabled);
      this._panelRefs.set(panel.id, panel);
    });
  }
}

export const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];
