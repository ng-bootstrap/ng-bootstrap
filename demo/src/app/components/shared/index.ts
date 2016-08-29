import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ExampleBoxComponent} from './example-box/example-box.component';
import {NgbdApiDocs} from './api-docs/api-docs.component';
import {NgbdApiDocsClass} from './api-docs/api-docs-class.component';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [ExampleBoxComponent, NgbdApiDocs, NgbdApiDocsClass],
  exports: [ExampleBoxComponent, NgbdApiDocs, NgbdApiDocsClass]
})
export class NgbdComponentsSharedModule {}
