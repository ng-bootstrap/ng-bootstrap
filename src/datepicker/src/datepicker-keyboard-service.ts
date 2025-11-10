import { Injectable } from '@angular/core';
import { NgbDatepicker } from './datepicker';

/**
 * A service that represents the keyboard navigation.
 *
 * Default keyboard shortcuts [are documented in the overview](#/components/datepicker/overview#keyboard-shortcuts)
 *
 * @since 5.2.0
 */
@Injectable({ providedIn: 'root' })
export class NgbDatepickerKeyboardService {
	/**
	 * Processes a keyboard event.
	 */
	processKey(event: KeyboardEvent, datepicker: NgbDatepicker) {
		const { state, calendar } = datepicker;
		switch (event.key) {
			case 'PageUp':
				datepicker.focusDate(calendar.getPrev(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
				break;
			case 'PageDown':
				datepicker.focusDate(calendar.getNext(state.focusedDate, event.shiftKey ? 'y' : 'm', 1));
				break;
			case 'End':
				datepicker.focusDate(event.shiftKey ? state.maxDate : state.lastDate);
				break;
			case 'Home':
				datepicker.focusDate(event.shiftKey ? state.minDate : state.firstDate);
				break;
			case 'ArrowLeft':
				datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', 1));
				break;
			case 'ArrowUp':
				datepicker.focusDate(calendar.getPrev(state.focusedDate, 'd', calendar.getDaysPerWeek()));
				break;
			case 'ArrowRight':
				datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', 1));
				break;
			case 'ArrowDown':
				datepicker.focusDate(calendar.getNext(state.focusedDate, 'd', calendar.getDaysPerWeek()));
				break;
			case 'Enter':
			case ' ':
				datepicker.focusSelect();
				break;
			default:
				return;
		}
		event.preventDefault();
		event.stopPropagation();
	}
}
