import {Injectable} from '@angular/core';
import {NgbCalendar} from './ngb-calendar';
import {NgbDatepicker} from './datepicker';
import {Key} from '../util/key';

/**
 * A service that represents the keyboard navigation.
 *
 * The default navigation is documented in the overview.
 */
@Injectable({providedIn: 'root'})
export class NgbDatepickerKeyboardService {
  /**
   * Processes a keyboard event.
   */
  processKey(event: KeyboardEvent, datepicker: NgbDatepicker, calendar: NgbCalendar) {
    const state = datepicker.state;
    // tslint:disable-next-line:deprecation
    switch (event.which) {
      case Key.PageUp:
        datepicker.focusDate(calendar.getNext(state.focusDate, event.shiftKey ? 'y' : 'm', -1));
        break;
      case Key.PageDown:
        datepicker.focusDate(calendar.getNext(state.focusDate, event.shiftKey ? 'y' : 'm', 1));
        break;
      case Key.End:
        datepicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
        break;
      case Key.Home:
        datepicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
        break;
      case Key.ArrowLeft:
        datepicker.focusDate(calendar.getNext(state.focusDate, 'd', -1));
        break;
      case Key.ArrowUp:
        datepicker.focusDate(calendar.getNext(state.focusDate, 'd', -calendar.getDaysPerWeek()));
        break;
      case Key.ArrowRight:
        datepicker.focusDate(calendar.getNext(state.focusDate, 'd', 1));
        break;
      case Key.ArrowDown:
        datepicker.focusDate(calendar.getNext(state.focusDate, 'd', calendar.getDaysPerWeek()));
        break;
      case Key.Enter:
      case Key.Space:
        datepicker.focusSelect();
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
  }
}
