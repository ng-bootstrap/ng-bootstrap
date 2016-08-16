import {NgModule} from '@angular/core';

import {NgbdSharedModule} from '../../shared';
import {ExampleBoxComponent} from './example-box/example-box.component';
import {NgbdApiDocs} from './api-docs/api-docs.component';

@NgModule({
  imports: [NgbdSharedModule],
  declarations: [ExampleBoxComponent, NgbdApiDocs],
  exports: [ExampleBoxComponent, NgbdApiDocs]
})
export class NgbdComponentsSharedModule {}
