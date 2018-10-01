import {Component, Input, OnChanges, ChangeDetectionStrategy, SimpleChanges} from '@angular/core';
import {regExpEscape, toString} from '../util/util';

/**
 * A component that can be used inside a custom result template in order to highlight the term inside the text of the
 * result
 */
@Component({
  selector: 'ngb-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
      `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
      `</ng-template>`,  // template needs to be formatted in a certain way so we don't add empty text nodes
  styleUrls: ['./highlight.scss']
})
export class NgbHighlight implements OnChanges {
  parts: string[];

  /**
   * The CSS class of the span elements wrapping the term inside the result
   */
  @Input() highlightClass = 'ngb-highlight';

  /**
   * The result text to display. If the term is found inside this text, it's highlighted
   */
  @Input() result: string;

  /**
   * The searched term
   */
  @Input() term: string;

  ngOnChanges(changes: SimpleChanges) {
    const resultStr = toString(this.result);
    const resultLC = resultStr.toLowerCase();
    const termLC = toString(this.term).toLowerCase();
    let currentIdx = 0;

    if (termLC.length > 0) {
      this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
        const originalPart = resultStr.substr(currentIdx, part.length);
        currentIdx += part.length;
        return originalPart;
      });
    } else {
      this.parts = [resultStr];
    }
  }
}
