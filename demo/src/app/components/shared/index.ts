import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ExampleBoxComponent} from './example-box';
import {NgbdApiDocs, NgbdApiDocsBadge, NgbdApiDocsClass, NgbdApiDocsConfig} from './api-docs';
import {NgbdFragment} from './fragment';
import {NgbdOverviewComponent} from './overview';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [
    ExampleBoxComponent, NgbdApiDocsBadge, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig,
    NgbdFragment, NgbdOverviewComponent
  ],
  exports: [
    ExampleBoxComponent, NgbdApiDocsBadge, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig,
    NgbdFragment, NgbdOverviewComponent
  ]
})
export class NgbdComponentsSharedModule {}
