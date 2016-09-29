import {NgModule, ModuleWithProviders} from '@angular/core';

import {NGB_POPOVER_DIRECTIVES, NgbPopoverWindow} from './popover';
import {NgbPopoverConfig} from './popover-config';

export {NgbPopoverConfig} from './popover-config';

@NgModule({declarations: NGB_POPOVER_DIRECTIVES, exports: NGB_POPOVER_DIRECTIVES, entryComponents: [NgbPopoverWindow]})
export class NgbPopoverModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbPopoverModule, providers: [NgbPopoverConfig]}; }
}
