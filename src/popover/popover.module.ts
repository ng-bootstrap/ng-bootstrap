import {NgModule} from '@angular/core';

import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from './popover';

@NgModule({declarations: NGB_POPOVER_DIRECTIVES, exports: NGB_POPOVER_DIRECTIVES, entryComponents: [NgbPopoverWindow]})
export class NgbPopoverModule {
}
