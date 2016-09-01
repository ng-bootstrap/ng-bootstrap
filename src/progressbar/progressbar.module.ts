import {NgModule} from '@angular/core';
import {NGB_PROGRESSBAR_DIRECTIVES} from './progressbar';
import {NgbProgressbarConfig} from './progressbar-config';

export {NgbProgressbarConfig} from './progressbar-config';

@NgModule(
    {declarations: NGB_PROGRESSBAR_DIRECTIVES, exports: NGB_PROGRESSBAR_DIRECTIVES, providers: [NgbProgressbarConfig]})
export class NgbProgressbarModule {
}
