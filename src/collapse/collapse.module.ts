import {NgModule, ModuleWithProviders} from '@angular/core';
import {NgbCollapse} from './collapse';

export {NgbCollapse} from './collapse';

@NgModule({declarations: [NgbCollapse], exports: [NgbCollapse]})
export class NgbCollapseModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbCollapseModule, providers: []}; }
}
