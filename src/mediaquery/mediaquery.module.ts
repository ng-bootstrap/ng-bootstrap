import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbMediaQuery} from './mediaquery.service';

export {NgbMediaQuery} from './mediaquery.service';

@NgModule({imports: [CommonModule]})
export class NgbMediaQueryModule {
  static forRoot(): ModuleWithProviders { return {ngModule: NgbMediaQueryModule, providers: [NgbMediaQuery]}; }
}
