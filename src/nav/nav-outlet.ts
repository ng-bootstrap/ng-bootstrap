import {
  Component,
  Input,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  NgZone,
  Directive,
  ViewChildren,
  QueryList,
  ChangeDetectorRef
} from '@angular/core';
import {NgbNav, NgbNavItem} from './nav';
import {NgbRunTransition} from '../util/transition/ngbTransition';
import {NgbNavFadingTransition} from '../util/transition/ngbFadingTransition';
import {takeUntil, take} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NgbNavConfig} from './nav-config';

@Directive({selector: '[ngbNavPane]'})
export class NavPane {
  constructor(public elementRef: ElementRef) {}
  @Input('ngbNavPane') item: NgbNavItem;
}

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
          <div class="tab-pane fade"
              [ngbNavPane]="item"
              *ngIf="item.isPanelInDom()"
              [id]="item.panelDomId"
              [attr.role]="paneRole ? paneRole : nav.roles ? 'tabpanel' : undefined"
              [attr.aria-labelledby]="item.domId">
              <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                           [ngTemplateOutletContext]="{$implicit: item.active}"></ng-template>
          </div>
      </ng-template>
  `
})
export class NgbNavOutlet implements AfterViewInit {
  /**
   * A role to set on the nav pane
   */
  @Input() paneRole;

  /**
   * Reference to the `NgbNav`
   */
  @Input('ngbNavOutlet') nav: NgbNav;

  @ViewChildren(NavPane) panes: QueryList<NavPane>;

  /**
   * A flag to enable/disable the animation when closing.
   */
  @Input() animation: boolean;

  private _activeId;

  /*
   * id of the nav with a running transition
   */
  private _transitionId;

  private _destroy$ = new Subject<void>();

  constructor(private _ngZone: NgZone, private _cd: ChangeDetectorRef, config: NgbNavConfig) {
    this.animation = config.animation;
  }

  ngOnDestroy() { this._destroy$.next(); }

  ngAfterViewInit() {
    this._activeId = this.nav.activeId;
    const panelElement = this.getPanelElement(this._activeId);
    if (panelElement) {
      const classList = panelElement.classList;
      classList.add('active');
      classList.add('show');
    }

    this.nav.panelChange.pipe(takeUntil(this._destroy$)).subscribe((activeId) => {
      this._ngZone.onStable.pipe(take(1)).subscribe(() => {
        if (this._activeId !== activeId) {
          const previousId = this._transitionId || this._activeId;
          const previousPanel = this.getPanel(previousId);
          const panel = this.getPanel(activeId);
          if (previousPanel) {
            this._transitionId = previousId;
            NgbRunTransition(previousPanel.elementRef.nativeElement, NgbNavFadingTransition, {
              animation: this.animation,
              data: {direction: 'hide'}
            }).subscribe(() => {
              previousPanel.item.transitionPending = false;
              this._cd.detectChanges();

              // Keep dom content in dom for the fade out transition
              if (panel) {
                this._transitionId = activeId;
                panel.item.transitionPending = this.animation;
                NgbRunTransition(panel.elementRef.nativeElement, NgbNavFadingTransition, {
                  animation: this.animation,
                  data: {direction: 'show'}
                }).subscribe(() => { this._transitionId = null; });
              }
            });
          } else {
            if (panel) {
              panel.item.transitionPending = this.animation;
              NgbRunTransition(panel.elementRef.nativeElement, NgbNavFadingTransition, {
                animation: this.animation,
                data: {direction: 'show'}
              }).subscribe(() => { this._transitionId = null; });
            }
          }
          this._activeId = activeId;
        }
      });
    });
  }

  private getPanel(id) {
    return this.panes.find((pane) => { return pane.item.id === id; });
  }
  private getPanelElement(id) {
    const pane = this.getPanel(id);
    return pane ? pane.elementRef.nativeElement : null;
  }
}
