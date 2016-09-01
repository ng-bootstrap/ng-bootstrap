import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ExampleBoxComponent} from './example-box/example-box.component';
import {NgbdApiDocs} from './api-docs/api-docs.component';
import {NgbdApiDocsClass} from './api-docs/api-docs-class.component';
import {NgbdApiDocsConfig} from './api-docs/api-docs-config.component';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [ExampleBoxComponent, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig],
  exports: [ExampleBoxComponent, NgbdApiDocs, NgbdApiDocsClass, NgbdApiDocsConfig]
})
export class NgbdComponentsSharedModule {}
