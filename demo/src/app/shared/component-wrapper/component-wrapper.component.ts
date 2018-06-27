import {Component, ContentChild, ContentChildren, Input, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ExampleBoxComponent} from '../../components/shared/example-box';
import {NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig} from '../../components/shared/api-docs';
import {NgbdOverviewComponent} from '../../components/shared/overview';

const VALID_TABS = ['overview', 'examples', 'api'];

@Component({selector: 'ngbd-component-wrapper', templateUrl: './component-wrapper.component.html'})
export class ComponentWrapper {
  @Input() component: string;

  activeTab: string;

  fileTypes = [
    ['T', 'HTML template file', 'btn-secondary'],
    ['C', 'Component typescript file', 'btn-info'],
  ];

  sidebarCollapsed = true;

  @ContentChild(NgbdOverviewComponent) overview;

  @ContentChildren(ExampleBoxComponent) demos;

  @ContentChildren(NgbdApiDocs) apiDocs;

  @ContentChildren(NgbdApiDocsClass) apiDocsClass;

  @ContentChildren(NgbdApiDocsConfig) apiDocsConfig;

  isSmallScreenOrLess: boolean;
  isLargeScreenOrLess: boolean;

  constructor(private route: ActivatedRoute, private router: Router, ngZone: NgZone) {
    this.route.params.subscribe(params => {
      const tab = params['tab'];
      if (VALID_TABS.indexOf(tab) !== -1) {
        this.activeTab = tab;
      } else {
        this.router.navigate(['..'], {relativeTo: this.route});
      }
      document.body.scrollIntoView();
    });

    // information extracted from https://getbootstrap.com/docs/4.1/layout/overview/
    // TODO: we should implements our own mediamatcher, according to bootstrap layout.
    const smallScreenQL = matchMedia('(max-width: 767.98px)');
    smallScreenQL.addListener((event) => ngZone.run(() => this.isSmallScreenOrLess = event.matches));
    this.isSmallScreenOrLess = smallScreenQL.matches;

    const largeScreenQL = matchMedia('(max-width: 1199.98px)');
    this.isLargeScreenOrLess = largeScreenQL.matches;
    largeScreenQL.addListener((event) => ngZone.run(() => this.isLargeScreenOrLess = event.matches));
  }

  tabChange(event) {
    this.router.navigate(['..', event.nextId], {relativeTo: this.route});
  }
}
