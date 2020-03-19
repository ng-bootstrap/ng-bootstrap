import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-popup',
  templateUrl: './datepicker-popup.html',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .datepicker.popover {
      max-width: none;
    }
    .datepicker.popover .arrow {
      display: none;
    }
    .datepicker.popover .popover-body {
      padding: 0;
    }
    .datepicker.popover ngb-datepicker {
      border: none;
    }
    .bs-popover-bottom {
      margin: .125rem 0 0;
    }
  `]
})
export class NgbdDatepickerPopup {
  model;
  value = '';

  constructor(
    private _elementRef: ElementRef,
    private _parserFormatter: NgbDateParserFormatter,
    private _calendar: NgbCalendar
  ) {}

  updateModel($event) {
    const newModel = this._parserFormatter.parse($event.target.value);
    if (this._calendar.isValid(NgbDate.from(newModel))) {
      this.model = newModel;
    }
  }

  updateValue($event) {
    this.model = $event;
    this.value = this._parserFormatter.format(this.model);
  }

  toggle(popover: any) {
    popover.toggle();
    setTimeout(() => {
      if (popover.isOpen()) {
        const date = this._elementRef.nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]');
        date.focus();
      }
    });
  }
}
