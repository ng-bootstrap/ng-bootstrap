import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {environment} from '../environments/environment';

interface Version {
  text: string;
  url: string;
}

@Component({
  selector: 'ngbd-demo-versions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nav-item" ngbDropdown>
      <a class="nav-link" ngbDropdownToggle id="demo-site-versions" role="button">
        ng-bootstrap v{{ current }}
      </a>
      <div ngbDropdownMenu aria-labelledby="demo-site-versions" class="dropdown-menu dropdown-menu-end">
        <a ngbDropdownItem *ngFor="let version of versions$ | async" href="{{ version.url }}#{{ routerUrl }}">{{ version.text }}</a>
      </div>
    </div>
  `
})

export class NgbdDemoVersionsComponent implements OnDestroy {
  current = environment.version;
  routerUrl = '';
  versions$: Promise<Version[]> = (window as any).NGB_DEMO_VERSIONS;

  private _subscription: Subscription;

  constructor(router: Router) {
    this._subscription = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.routerUrl = event.url;
    });
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
