import {NgbDateNativeAdapter} from '../../datepicker/adapters/ngb-date-native-adapter';
import {NgbDateStruct} from '../../datepicker/ngb-date-struct';
import {NgbDateStructAdapter} from '../../datepicker/adapters/ngb-date-adapter';

export function getNavigationLinks(element: HTMLElement): HTMLElement[] {
  return <HTMLElement[]>Array.from(element.querySelectorAll('button'));
}

export function getMonthSelect(element: HTMLElement): HTMLSelectElement {
  return element.querySelectorAll('select')[0] as HTMLSelectElement;
}

export function getYearSelect(element: HTMLElement): HTMLSelectElement {
  return element.querySelectorAll('select')[1] as HTMLSelectElement;
}

export type SupportedDate = Date | NgbDateStruct;

export const ADAPTERS = [
  {type: NgbDateStructAdapter, instance: new NgbDateStructAdapter()},
  {type: NgbDateNativeAdapter, instance: new NgbDateNativeAdapter()}
];
