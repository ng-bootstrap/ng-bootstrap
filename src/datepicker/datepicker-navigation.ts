import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {NavigationEvent, MonthViewModel} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';

// The -ms- and -webkit- element for the CSS can be removed if we are generating the CSS using SASS.
@Component({
  selector: 'ngb-datepicker-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    :host {
      height: 2rem;
      line-height: 1.85rem;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
    }
    .ngb-dp-navigation-chevron {
      border-style: solid;
      border-width: 0.2em 0.2em 0 0;
      display: inline-block;
      width: 0.75em;
      height: 0.75em;
      margin-left: 0.25em;
      margin-right: 0.15em;
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
      -ms-transform: rotate(-135deg);
    }
    .right .ngb-dp-navigation-chevron {
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-left: 0.15em;
      margin-right: 0.25em;
    }
    .ngb-dp-arrow {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-flex: 1 1 auto;
      -ms-flex: 1 1 auto;
      flex-basis: auto;
      flex-grow: 1;
      padding-right: 0px;
      padding-left: 0px;
      margin: 0px;
      width: 2rem;
      height: 2rem;
    }
    .ngb-dp-arrow.right {
      -webkit-box-pack: end;
      -ms-flex-pack: end;
      justify-content: flex-end;
    }
    .ngb-dp-arrow-btn {
      padding: 0rem 0.25rem;
      margin: 0rem 0.5rem;
      border: none;
      background-color: transparent;
      z-index: 1;
    }
    .ngb-dp-arrow-btn:focus {
      outline-style: auto;
      outline-width: 1px;
    }
    .ngb-dp-month-name {
      font-size: larger;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
    }
    .ngb-dp-navigation-select {
      -webkit-box-flex: 1 1 9rem;
      -ms-flex:  1 1 9rem;
      flex-grow: 1;
      flex-basis: 9rem;
    }
  `],
  template: `
  <div class="ngb-dp-arrow">
    <button type="button" class="btn btn-link ngb-dp-arrow-btn"
            (click)="!!navigate.emit(navigation.PREV)" [disabled]="prevDisabled">
      <span class="ngb-dp-navigation-chevron"></span>
    </button>
  </div>
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="d-block ngb-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </ngb-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
      <div class="ngb-dp-month-name d-block">
        {{ i18n.getMonthFullName(month.number) }} {{ month.year }}
      </div>
      <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="ngb-dp-arrow right">
    <button type="button" class="btn btn-link ngb-dp-arrow-btn"
            (click)="!!navigate.emit(navigation.NEXT)" [disabled]="nextDisabled">
      <span class="ngb-dp-navigation-chevron"></span>
    </button>
    </div>
    `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() months: MonthViewModel[] = [];
  @Input() showSelect: boolean;
  @Input() prevDisabled: boolean;
  @Input() nextDisabled: boolean;
  @Input() selectBoxes: {years: number[], months: number[]};

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n) {}
}
