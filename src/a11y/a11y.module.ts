import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbPlatform} from './platform';
import {NgbInteractivityChecker} from './interactivity-checker';
import {NgbFocusTrapFactory, NgbFocusTrapDirective} from './focus-trap';

export {NgbPlatform} from './platform';
export {NgbInteractivityChecker} from './interactivity-checker';
export {NgbFocusTrapFactory, NgbFocusTrapDirective, NgbFocusTrap} from './focus-trap';

@NgModule({declarations: [NgbFocusTrapDirective], exports: [NgbFocusTrapDirective], imports: [CommonModule]})
export class NgbA11yModule {
  static forRoot(): ModuleWithProviders {
    return {ngModule: NgbA11yModule, providers: [NgbFocusTrapFactory, NgbInteractivityChecker, NgbPlatform]};
  }
}
