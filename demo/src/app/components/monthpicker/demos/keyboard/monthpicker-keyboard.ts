import { Component, Injectable } from '@angular/core';
import {
	NgbMonthpicker,
	NgbMonthpickerKeyboardService,
	NgbMonthpickerModule,
	NgbMonthStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

const Key = {
	PageUp: 'PageUp',
	PageDown: 'PageDown',
	End: 'End',
	Home: 'Home',
};

@Injectable()
export class CustomKeyboardService extends NgbMonthpickerKeyboardService {
	processKey(event: KeyboardEvent, mp: NgbMonthpicker) {
		const state = mp.state;
		switch (event.code) {
			case Key.PageUp:
				mp.focusDate(mp.calendar.getPrev(state.focusedDate, event.altKey ? 'y' : 'm'));
				break;
			case Key.PageDown:
				mp.focusDate(mp.calendar.getNext(state.focusedDate, event.altKey ? 'y' : 'm'));
				break;
			case Key.End:
				mp.focusDate(event.altKey ? state.maxDate : state.lastDate);
				break;
			case Key.Home:
				mp.focusDate(event.altKey ? state.minDate : state.firstDate);
				break;
			default:
				super.processKey(event, mp);
				return;
		}
		event.preventDefault();
		event.stopPropagation();
	}
}

@Component({
	selector: 'ngbd-monthpicker-keyboard',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	templateUrl: './monthpicker-keyboard.html',
	providers: [{ provide: NgbMonthpickerKeyboardService, useClass: CustomKeyboardService }],
})
export class NgbdMonthpickerKeyboard {
	model: NgbMonthStruct;
}
