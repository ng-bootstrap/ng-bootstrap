import {Component, Input, OnChanges, ChangeDetectionStrategy} from '@angular/core';
import {regExpEscape, toDefinedString} from '../util/util';

@Component({
  selector: 'ngb-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<template ngFor [ngForOf]="_parts" let-part let-isOdd="odd">` +
      `<span *ngIf="isOdd" class="{{highlightClass}}">{{part}}</span><template [ngIf]="!isOdd">{{part}}</template>` +
      `</template>`,  // template needs to be formatted in a certain way so we don't add empty text nodes
  styles: [`
    .ngb-highlight {
      font-weight: bold;
    }
  `]
})
export class NgbHighlight implements OnChanges {
  private _parts: string[];

  @Input() highlightClass = 'ngb-highlight';
  @Input() result: string;
  @Input() term: string;

  ngOnChanges() {
    const resultStr = toDefinedString(this.result);
    const resultLC = resultStr.toLowerCase();
    const termLC = toDefinedString(this.term).toLowerCase();
    let currentIdx = 0;

    if (termLC.length > 0) {
      this._parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
        const originalPart = resultStr.substr(currentIdx, part.length);
        currentIdx += part.length;
        return originalPart;
      });
    } else {
      this._parts = [resultStr];
    }
  }
}
