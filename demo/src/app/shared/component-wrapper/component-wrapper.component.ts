import {Component, OnDestroy, Type} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {NgbdApiPage} from '../../components/shared/api-page/api.component';
import {NgbdExamplesPage} from '../../components/shared/examples-page/examples.component';

import {environment} from '../../../environments/environment';

export type TableOfContents = { fragment: string, title: string }[];

@Component({
  selector: 'component-wrapper',
  templateUrl: 'component-wrapper.component.html'
})

export class ComponentWrapper implements OnDestroy {
  private _routerSubscription: Subscription;

  activeTab = 'examples';

  component: string;

  headerComponentType$: Observable<Type<any>>;
  bootstrapUrl$: Observable<string>;

  tableOfContents: TableOfContents = [];

  constructor(public route: ActivatedRoute, private _router: Router) {
    // This component is used in route definition 'components'
    // So next child route will always be ':componentType' & next one will always be ':pageType' (or tab)

    this._routerSubscription = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const parentRoute = this.route.snapshot.parent;
      const tabRoute = this.route.snapshot.firstChild;

      this.component = parentRoute!.url[1].path;
      this.activeTab = tabRoute!.url[0].path;
    });

    this.headerComponentType$ = this.route.data.pipe(map(data => data?.header));
    this.bootstrapUrl$ = this.route.data.pipe(map(data => data?.bootstrap?.replace('%version%', environment.bootstrap)));
  }

  ngOnDestroy() {
    this._routerSubscription.unsubscribe();
  }

  updateNavigation(component: NgbdExamplesPage | NgbdApiPage | any) {
    const getLinks = (typeCollection: string[]) => {
      return typeCollection.map(item => ({
        fragment: item,
        title: item
      }));
    };
    this.tableOfContents = [];
    if (component instanceof NgbdExamplesPage) {
      this.tableOfContents = component.demos.map(demo => {
        return {
          fragment: demo.id,
          title: demo.title
        };
      });
    } else if (component instanceof NgbdApiPage) {
      let toc = getLinks(component.components);

      if (component.classes.length > 0) {
        const klasses = getLinks(component.classes);
        toc = toc.concat(toc.length > 0 ? [<any>{}, ...klasses] : klasses);
      }

      if (component.configs.length > 0) {
        const configs = getLinks(component.configs);
        toc = toc.concat(toc.length > 0 ? [<any>{}, ...configs] : configs);
      }

      this.tableOfContents = toc;

    } else /* Overview */ {
      // TODO: maybe we should also have an abstract class to test instanceof
      this.tableOfContents = Object.values(component.sections).map(section => section) as TableOfContents;
    }
  }
}
