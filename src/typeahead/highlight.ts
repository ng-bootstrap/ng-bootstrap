import {Component, Input, OnChanges, ChangeDetectionStrategy, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {regExpEscape, toString} from '../util/util';

/**
 * A component that helps with text highlighting.
 *
 * If splits the `result` text into parts that contain the searched `term` and generates the HTML markup to simplify
 * highlighting:
 *
 * Ex. `result="Alaska"` and `term="as"` will produce `Al<span class="ngb-highlight">as</span>ka`.
 */
@Component({
  selector: 'ngb-highlight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
      `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
      `</ng-template>`,  // template needs to be formatted in a certain way so we don't add empty text nodes
  styleUrls: ['./highlight.scss']
})
export class NgbHighlight implements OnChanges {
  parts: string[];

  /**
   * The CSS class for `<span>` elements wrapping the `term` inside the `result`.
   */
  @Input() highlightClass = 'ngb-highlight';

  /**
   * The text highlighting is added to.
   *
   * If the `term` is found inside this text, it will be highlighted.
   * If the `term` contains array then all the items from it will be highlighted inside the text.
   */
  @Input() result?: string | null;

  /**
   * The term or array of terms to be highlighted.
   * Since version `v4.2.0` term could be a `string[]`
   */
  @Input() term: string | readonly string[];

  ngOnChanges(changes: SimpleChanges) {
    const result = toString(this.result);

    const terms = Array.isArray(this.term) ? this.term : [this.term];
    const escapedTerms = terms.map(term => regExpEscape(toString(term))).filter(term => term);

    this.parts = escapedTerms.length ? result.split(new RegExp(`(${escapedTerms.join('|')})`, 'gmi')) : [result];
  }
}
