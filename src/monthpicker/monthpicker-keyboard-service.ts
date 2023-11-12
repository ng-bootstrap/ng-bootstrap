import { Injectable } from '@angular/core';
import { NgbMonthpicker } from './monthpicker';
import { Key } from '../util/key';

/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/monthpicker/overview#keyboard-shortcuts)
 */
@Injectable({ providedIn: 'root' })
export class NgbMonthpickerKeyboardService {
	/**
	 * Processes a keyboard event.
	 */
	processKey(event: KeyboardEvent, monthpicker: NgbMonthpicker) {
		const { state, calendar } = monthpicker;
		/* eslint-disable-next-line deprecation/deprecation */
		switch (event.which) {
			case Key.PageUp:
				monthpicker.focusDate(calendar.getPrev(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
				break;
			case Key.PageDown:
				monthpicker.focusDate(calendar.getNext(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
				break;
			case Key.End:
				monthpicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
				break;
			case Key.Home:
				monthpicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
				break;
			case Key.ArrowLeft:
				monthpicker.focusDate(calendar.getPrev(state.focusedDate, 'm', 1));
				break;
			case Key.ArrowUp:
				monthpicker.focusDate(calendar.getPrev(state.focusedDate, 'm', 3));
				break;
			case Key.ArrowRight:
				monthpicker.focusDate(calendar.getNext(state.focusedDate, 'm', 1));
				break;
			case Key.ArrowDown:
				monthpicker.focusDate(calendar.getNext(state.focusedDate, 'm', 3));
				break;
			case Key.Enter:
			case Key.Space:
				monthpicker.focusSelect();
				break;
			default:
				return;
		}
		event.preventDefault();
		event.stopPropagation();
	}
}
