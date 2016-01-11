import {INgbDatepickerEngine} from './IDatepickerEngine';

export class NgbDatepickerEngine implements INgbDatepickerEngine {
  getDays(year: number, month: number, startOnMonday: boolean): number[] {
    let days: number[] = [];
    let selectedDate = new Date(year, month, 1);
    const startingDay = startOnMonday ? 1 : 0;
    const difference = startingDay - selectedDate.getDay();
    const daysFromPreviousMonth = difference > 0 ? 7 - difference : -difference;

    selectedDate.setDate(-daysFromPreviousMonth + 1);

    for (let i = 0; i < 42; i++) {
      days[i] = selectedDate.getDate();
      selectedDate.setDate(selectedDate.getDate() + 1);
    }

    return days;
  }
}
