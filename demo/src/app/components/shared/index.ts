import { NgModule } from '@angular/core';

import { NgbdSharedModule } from '../../shared';
import { NgbdApiDocs, NgbdApiDocsBadge, NgbdApiDocsClass, NgbdApiDocsConfig } from './api-docs';
import { NgbdApiPage } from './api-page/api.component';
import { ExampleBoxComponent } from './example-box';
import { NgbdWidgetDemoComponent } from './examples-page/demo.component';
import { NgbdExamplesPage } from './examples-page/examples.component';
import { NgbdFragment } from './fragment';
import { NgbdOverviewDirective, NgbdOverviewSectionComponent } from './overview';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [
    ExampleBoxComponent,
    NgbdApiDocsBadge,
    NgbdApiDocs,
    NgbdApiDocsClass,
    NgbdApiDocsConfig,
    NgbdFragment,
    NgbdOverviewDirective,
    NgbdOverviewSectionComponent,
    NgbdExamplesPage,
    NgbdApiPage,
    NgbdWidgetDemoComponent
  ],
  exports: [
    ExampleBoxComponent,
    NgbdApiDocsBadge,
    NgbdApiDocs,
    NgbdApiDocsClass,
    NgbdApiDocsConfig,
    NgbdFragment,
    NgbdOverviewDirective,
    NgbdOverviewSectionComponent,
    NgbdExamplesPage,
    NgbdApiPage
  ]
})
export class NgbdComponentsSharedModule {}
