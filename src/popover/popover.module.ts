import {NgModule, ModuleWithProviders} from '@angular/core';

import {NgbPopover, NgbPopoverWindow} from './popover';
import {NgbPopoverConfig} from './popover-config';
import {Placement} from '../util/positioning';
import {AutoCloseService} from '../util/autoclose.service';

export {NgbPopover} from './popover';
export {NgbPopoverConfig} from './popover-config';
export {Placement} from '../util/positioning';

@NgModule({declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], entryComponents: [NgbPopoverWindow]})
export class NgbPopoverModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: NgbPopoverModule, providers: [NgbPopoverConfig, AutoCloseService]};
  }
}
