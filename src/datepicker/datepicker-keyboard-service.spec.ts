import { NgbDatepicker, NgbDatepickerState } from './datepicker';
import { NgbDatepickerKeyboardService } from './datepicker-keyboard-service';
import { NgbCalendar, NgbCalendarGregorian } from './ngb-calendar';
import { TestBed } from '@angular/core/testing';
import { NgbDate } from './ngb-date';

const event = (key: string, shift = false) =>
	<any>{ key, shiftKey: shift, preventDefault: () => {}, stopPropagation: () => {} };

describe('ngb-datepicker-keyboard-service', () => {
	let service: NgbDatepickerKeyboardService;
	let calendar: NgbCalendar;
	let mock: Partial<NgbDatepicker>;
	let processKey = function (e: KeyboardEvent) {
		service.processKey(e, mock as NgbDatepicker);
	};
	let state: NgbDatepickerState = Object.assign({ focusedDate: { day: 1, month: 1, year: 2018 } });

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{ provide: NgbCalendar, useClass: NgbCalendarGregorian }, NgbDatepickerKeyboardService],
		});

		calendar = TestBed.inject(NgbCalendar);
		service = TestBed.inject(NgbDatepickerKeyboardService);
		mock = { state, focusDate: () => {}, focusSelect: () => {}, calendar };

		spyOn(mock, <any>'focusDate');
		spyOn(mock, <any>'focusSelect');
		spyOn(calendar, 'getNext');
		spyOn(calendar, 'getPrev');
	});

	it('should be instantiated', () => {
		expect(service).toBeTruthy();
	});

	it('should move focus by 1 day or 1 week with "Arrow" keys', () => {
		processKey(event('ArrowUp'));
		expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'd', 7);

		processKey(event('ArrowDown'));
		expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'd', 7);

		processKey(event('ArrowLeft'));
		expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'd', 1);

		processKey(event('ArrowRight'));
		expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'd', 1);

		expect(calendar.getPrev).toHaveBeenCalledTimes(2);
		expect(calendar.getNext).toHaveBeenCalledTimes(2);
	});

	it('should move focus by 1 month or year "PgUp" and "PageDown"', () => {
		processKey(event('PageUp'));
		expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'm', 1);

		processKey(event('PageDown'));
		expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'm', 1);

		processKey(event('PageUp', true));
		expect(calendar.getPrev).toHaveBeenCalledWith(state.focusedDate, 'y', 1);

		processKey(event('PageDown', true));
		expect(calendar.getNext).toHaveBeenCalledWith(state.focusedDate, 'y', 1);

		expect(calendar.getPrev).toHaveBeenCalledTimes(2);
		expect(calendar.getNext).toHaveBeenCalledTimes(2);
	});

	it('should select focused date with "Space" and "Enter"', () => {
		processKey(event('Enter'));
		processKey(event(' '));
		expect(mock.focusSelect).toHaveBeenCalledTimes(2);
	});

	it('should move focus to the first and last days in the view with "Home" and "End"', () => {
		processKey(event('Home'));
		expect(mock.focusDate).toHaveBeenCalledWith(undefined);

		processKey(event('End'));
		expect(mock.focusDate).toHaveBeenCalledWith(undefined);

		Object.assign(state, { firstDate: new NgbDate(2017, 1, 1) });
		Object.assign(state, { lastDate: new NgbDate(2017, 12, 1) });

		processKey(event('Home'));
		expect(mock.focusDate).toHaveBeenCalledWith(new NgbDate(2017, 1, 1));

		processKey(event('End'));
		expect(mock.focusDate).toHaveBeenCalledWith(new NgbDate(2017, 12, 1));

		expect(mock.focusDate).toHaveBeenCalledTimes(4);
	});

	it('should move focus to the "min" and "max" dates with "Home" and "End"', () => {
		processKey(event('Home', true));
		expect(mock.focusDate).toHaveBeenCalledWith(undefined);

		processKey(event('End', true));
		expect(mock.focusDate).toHaveBeenCalledWith(undefined);

		Object.assign(state, { minDate: new NgbDate(2017, 1, 1) });
		Object.assign(state, { maxDate: new NgbDate(2017, 12, 1) });

		processKey(event('Home', true));
		expect(mock.focusDate).toHaveBeenCalledWith(new NgbDate(2017, 1, 1));

		processKey(event('End', true));
		expect(mock.focusDate).toHaveBeenCalledWith(new NgbDate(2017, 12, 1));

		expect(mock.focusDate).toHaveBeenCalledTimes(4);
	});

	it('should prevent default and stop propagation of the known key', () => {
		let e = event('ArrowUp');
		spyOn(e, 'preventDefault');
		spyOn(e, 'stopPropagation');

		processKey(e);
		expect(e.preventDefault).toHaveBeenCalled();
		expect(e.stopPropagation).toHaveBeenCalled();

		// unknown key
		e = event('blah');
		spyOn(e, 'preventDefault');
		spyOn(e, 'stopPropagation');

		processKey(e);
		expect(e.preventDefault).not.toHaveBeenCalled();
		expect(e.stopPropagation).not.toHaveBeenCalled();
	});
});
