import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ExampleBoxComponent} from './example-box';
import {NgbdApiDocs, NgbdApiDocsBadge, NgbdApiDocsClass, NgbdApiDocsConfig} from './api-docs';
import {NgbdFragment} from './fragment';
import {NgbdOverviewDirective, NgbdOverviewSectionComponent} from './overview';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [
    ExampleBoxComponent, NgbdApiDocsBadge, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig,
    NgbdFragment, NgbdOverviewDirective, NgbdOverviewSectionComponent
  ],
  exports: [
    ExampleBoxComponent, NgbdApiDocsBadge, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig,
    NgbdFragment, NgbdOverviewDirective, NgbdOverviewSectionComponent
  ]
})
export class NgbdComponentsSharedModule {}
