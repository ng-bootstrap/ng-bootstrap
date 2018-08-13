import {
  Directive,
  OnInit,
  OnDestroy,
  QueryList,
  Input,
  NgModule,
  ContentChildren,
  OnChanges,
  AfterContentInit
} from '@angular/core';
import {NgbTabsetModule, NgbTabset, NgbTabChangeEvent, NgbTab} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, RouterLink, Router, NavigationEnd} from '@angular/router';
import {LocationStrategy, CommonModule} from '@angular/common';
import {Subscription, of, merge, BehaviorSubject, concat} from 'rxjs';
import {switchMap, filter, map} from 'rxjs/operators';

/**
 * The NgbTabWithRoute directive allows to link an ngb-tab element with a route.
 * When this directive is used, the href property of the tab is automatically set based on the route.
 */
@Directive({selector: 'ngb-tab[routerLink]'})
export class NgbTabWithRoute implements OnInit, OnDestroy, OnChanges {
  private _subscription: Subscription;

  /**
   * routerLink property from the routerLink directive, cf https://angular.io/api/router/RouterLink#routerLink
   */
  @Input() routerLink;

  /**
   * preserveQueryParams property from the routerLink directive, cf
   * https://angular.io/api/router/RouterLink#preserveQueryParams
   */
  @Input() preserveQueryParams;

  /**
   * queryParams property from the routerLink directive, cf https://angular.io/api/router/RouterLink#queryParams
   */
  @Input() queryParams;

  /**
   * fragment property from the routerLink directive, cf https://angular.io/api/router/RouterLink#fragment
   */
  @Input() fragment;

  /**
   * queryParamsHandling property from the routerLink directive, cf
   * https://angular.io/api/router/RouterLink#queryParamsHandling
   */
  @Input() queryParamsHandling;

  /**
   * preserveFragment property from the routerLink directive, cf
   * https://angular.io/api/router/RouterLink#preserveFragment
   */
  @Input() preserveFragment;

  /**
   * skipLocationChange property from the routerLink directive, cf
   * https://angular.io/api/router/RouterLink#skipLocationChange
   */
  @Input() skipLocationChange;

  /**
   * Whether the url has to match exactly to make the tab active
   * (when 'exact' is false, a route will also be considered active when a child root is active).
   */
  @Input() exact = false;

  public active = new BehaviorSubject(false);

  constructor(
      public tabRef: NgbTab, public routerLinkRef: RouterLink, public router: Router,
      public locationStrategy: LocationStrategy) {}

  ngOnInit() {
    this._update();
    this._subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._update();
      }
    });
  }

  ngOnChanges() { this._update(); }

  ngOnDestroy() { this._subscription.unsubscribe(); }

  private _update() {
    const urlTree = this.routerLinkRef.urlTree;
    this.tabRef.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(urlTree));
    const newActive = this.router.isActive(urlTree, this.exact);
    if (newActive !== this.active.value) {
      this.active.next(newActive);
    }
  }
}

/**
 * The NgbRouterControlledTabset directive synchronizes an ngb-tabset element with the Angular router, so that clicking
 * on a tab triggers navigation and any navigation in the router triggers an update of the active tab.
 */
@Directive({selector: 'ngb-tabset[routerControlled]'})
export class NgbRouterControlledTabset implements AfterContentInit, OnInit, OnDestroy {
  @ContentChildren(NgbTabWithRoute) tabs: QueryList<NgbTabWithRoute>;

  private _tabsetTabChange: Subscription;
  private _activeChanged: Subscription;

  constructor(public tabset: NgbTabset) {}

  ngOnInit() {
    this._tabsetTabChange = this.tabset.tabChange.subscribe((event: NgbTabChangeEvent) => {
      const selectedTab = this.tabs.find(tab => tab.tabRef.id === event.nextId);
      if (selectedTab) {
        event.preventDefault();
        selectedTab.routerLinkRef.onClick();
      }
    });
  }

  ngOnDestroy() {
    this._tabsetTabChange.unsubscribe();
    this._activeChanged.unsubscribe();
  }

  ngAfterContentInit() {
    this._activeChanged =
        concat(of(null), this.tabs.changes)
            .pipe(
                switchMap(
                    () => merge(...this.tabs.map(tab => tab.active.pipe(filter(active => active), map(() => tab))))))
            .subscribe(activeTab => this.tabset.activeId = activeTab.tabRef.id);
  }
}

const NGB_TABSET_ROUTING_DIRECTIVES = [NgbTabWithRoute, NgbRouterControlledTabset];

@NgModule({
  declarations: NGB_TABSET_ROUTING_DIRECTIVES,
  exports: NGB_TABSET_ROUTING_DIRECTIVES,
  imports: [CommonModule, NgbTabsetModule, RouterModule]
})
export class NgbTabsetRoutingModule {
}
