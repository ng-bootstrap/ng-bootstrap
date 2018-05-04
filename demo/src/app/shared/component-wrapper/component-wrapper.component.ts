import {Component, Input, ContentChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ExampleBoxComponent} from '../../components/shared/example-box';
import {NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig} from '../../components/shared/api-docs';

export const DEFAULT_TAB = 'examples';
const VALID_TABS = [DEFAULT_TAB, 'api'];

@Component({selector: 'ngbd-component-wrapper', templateUrl: './component-wrapper.component.html'})
export class ComponentWrapper {
  @Input() component: string;

  activeTab: string;

  fileTypes = [
    ['T', 'HTML template file', 'btn-secondary'],
    ['C', 'Component typescript file', 'btn-info'],
  ];

  sidebarCollapsed = true;

  // TODO: change to @ContentChild(OVerviewBoxComponent) when implemented
  hasOverview = false;

  @ContentChildren(ExampleBoxComponent) demos;

  @ContentChildren(NgbdApiDocs) apiDocs;

  @ContentChildren(NgbdApiDocsClass) apiDocsClass;

  @ContentChildren(NgbdApiDocsConfig) apiDocsConfig;

  isMobile: boolean;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      const tab = params['tab'];
      if (VALID_TABS.indexOf(tab) !== -1) {
        this.activeTab = tab;
      } else {
        this.router.navigate(['..', DEFAULT_TAB], {relativeTo: this.route});
      }
      document.body.scrollIntoView();
    });

    // information extracted from https://getbootstrap.com/docs/4.1/layout/overview/
    // TODO: we should implements our own mediamatcher, according to bootstrap layout.
    const mobileQL = window.matchMedia('(max-width: 767.98px)');
    this.isMobile = mobileQL.matches;
    mobileQL.addListener((event) => { this.isMobile = event.matches; });
  }
}
