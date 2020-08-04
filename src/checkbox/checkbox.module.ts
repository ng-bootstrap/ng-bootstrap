import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {NgbCheckbox} from './checkbox';

export {NgbCheckbox} from './checkbox';

@NgModule({declarations: [NgbCheckbox], exports: [NgbCheckbox], imports: [CommonModule]})
export class NgbCheckboxModule {
}
