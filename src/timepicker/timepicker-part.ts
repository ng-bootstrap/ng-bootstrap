import {
  Component,
  Input,
} from '@angular/core';

import {PartUI} from './timepicker';



@Component({
  selector: 'ngb-timepicker-part',
  template: `
    <div
      [ngClass]="classes"
    >
      <button
        *ngIf="spinners"

        type="button"
        tabindex="-1"
        [disabled]="disabled"

        class="btn btn-link"
        [class.btn-sm]="isSmall"
        [class.btn-lg]="isLarge"
        [class.disabled]="disabled"

        (click)="increment()"
      >
        <span class="chevron ngb-tp-chevron"></span>
        <span class="sr-only">{{label_increment}}</span>
      </button>

      <input
        type="text"
        maxlength="2"
        [readonly]="readonly"
        [disabled]="disabled"

        class="ngb-tp-input form-control"
        [class.form-control-sm]="isSmall"
        [class.form-control-lg]="isLarge"

        [placeholder]="placeholder"
        [attr.aria-label]="aria_label"

        [value]="value"

        (change)="change($event.target.value)"
        (keydown.ArrowUp)="increment(); $event.preventDefault();"
        (keydown.ArrowDown)="decrement(); $event.preventDefault();"
      >

      <button
        *ngIf="spinners"

        type="button"
        tabindex="-1"
        [disabled]="disabled"

        class="btn btn-link"
        [class.btn-sm]="isSmall"
        [class.btn-lg]="isLarge"
        [class.disabled]="disabled"

        (click)="decrement()"
      >
        <span class="chevron ngb-tp-chevron bottom"></span>
        <span class="sr-only">{{label_decrement}}</span>
      </button>
    </div>
  `,
})
export class NgbTimepickerPart {
  @Input() wrapper: PartUI;

  @Input('class-part') class_part: string;

  @Input() spinners = true;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  @Input() placeholder: string;
  @Input('aria-label') aria_label: string;
  @Input('label-increment') label_increment: string;
  @Input('label-decrement') label_decrement: string;

  get value(): string { return this.wrapper.formattedValue; }

  get isSmall(): boolean { return this.size === 'small'; }
  get isLarge(): boolean { return this.size === 'large'; }

  get classes(): string[] { return ['ngb-tp-input-container', `ngb-tp-${this.class_part}`]; }

  increment() { this.wrapper.increment(); }
  decrement() { this.wrapper.decrement(); }
  change(value: string) { this.wrapper.setFromField(value); }
}
