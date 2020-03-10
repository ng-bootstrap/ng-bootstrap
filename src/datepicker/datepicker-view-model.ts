import {NgbDate} from './ngb-date';
import {NgbDateStruct} from './ngb-date-struct';
import {DayTemplateContext} from './datepicker-day-template-context';

export type NgbMarkDisabled = (date: NgbDateStruct, current?: {year: number, month: number}) => boolean;
export type NgbDayTemplateData = (date: NgbDateStruct, current?: {year: number, month: number}) => any;

export type DayViewModel = {
  date: NgbDate,
  context: DayTemplateContext,
  tabindex: number,
  ariaLabel: string,
  hidden: boolean
};

export type WeekViewModel = {
  number: number,
  days: DayViewModel[],
  collapsed: boolean
};

export type MonthViewModel = {
  firstDate: NgbDate,
  lastDate: NgbDate,
  number: number,
  year: number,
  weeks: WeekViewModel[],
  weekdays: number[]
};

// clang-format off
export type DatepickerViewModel = {
  dayTemplateData: NgbDayTemplateData | null,
  disabled: boolean,
  displayMonths: number,
  firstDate: NgbDate | null,
  firstDayOfWeek: number,
  focusDate: NgbDate | null,
  focusVisible: boolean,
  lastDate: NgbDate | null,
  markDisabled: NgbMarkDisabled | null,
  maxDate: NgbDate | null,
  minDate: NgbDate | null,
  months: MonthViewModel[],
  navigation: 'select' | 'arrows' | 'none',
  outsideDays: 'visible' | 'collapsed' | 'hidden',
  prevDisabled: boolean,
  nextDisabled: boolean,
  selectBoxes: {
    years: number[],
    months: number[]
  },
  selectedDate: NgbDate | null
};
// clang-format on

export enum NavigationEvent {
  PREV,
  NEXT
}
