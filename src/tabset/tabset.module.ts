import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle} from './tabset';

export {NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTabChangeEvent} from './tabset';
export {NgbTabsetConfig} from './tabset-config';

const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];

@NgModule({declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule]})
export class NgbTabsetModule {
}
