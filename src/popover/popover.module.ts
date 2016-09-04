import {NgModule} from '@angular/core';

import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from './popover';
import {NgbPopoverConfig} from './popover-config';

export {NgbPopoverConfig} from './popover-config';

@NgModule({
  declarations: NGB_POPOVER_DIRECTIVES,
  exports: NGB_POPOVER_DIRECTIVES,
  entryComponents: [NgbPopoverWindow],
  providers: [NgbPopoverConfig]
})
export class NgbPopoverModule {
}
