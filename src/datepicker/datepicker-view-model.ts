import {NgbDate} from './ngb-date';

export type DayViewModel = {
  date: NgbDate,
  disabled: boolean
}

export type WeekViewModel = {
  number: number,
  days: DayViewModel[]
}

export type MonthViewModel = {
  number: number,
  year: number,
  weeks: WeekViewModel[],
  weekdays: number[]
};

export enum NavigationEvent {
  PREV,
  NEXT
}
