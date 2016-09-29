import {NgModule, ModuleWithProviders} from '@angular/core';
import {NGB_PROGRESSBAR_DIRECTIVES} from './progressbar';
import {NgbProgressbarConfig} from './progressbar-config';

export {NgbProgressbarConfig} from './progressbar-config';

@NgModule({declarations: NGB_PROGRESSBAR_DIRECTIVES, exports: NGB_PROGRESSBAR_DIRECTIVES})
export class NgbProgressbarModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbProgressbarModule, providers: [NgbProgressbarConfig]}; }
}
