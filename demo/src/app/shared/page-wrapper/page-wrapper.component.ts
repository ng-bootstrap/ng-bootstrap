import {Component, ContentChildren, Input, QueryList} from '@angular/core';
import {NgbdPageHeaderComponent} from './page-header.component';
import {TableOfContents} from '../component-wrapper/component-wrapper.component';

@Component({
  selector: 'ngbd-page-wrapper',
  templateUrl: './page-wrapper.component.html'
})
export class PageWrapper {
  @Input() pageTitle: string;

  @ContentChildren(NgbdPageHeaderComponent) private _tableOfContents: QueryList<NgbdPageHeaderComponent>;

  get tableOfContents(): TableOfContents {
    return this._tableOfContents ? this._tableOfContents.toArray() : [];
  }
}
