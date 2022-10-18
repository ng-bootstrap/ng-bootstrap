import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	clickOutside,
	closeDatepicker,
	expectDatepickerToBeClosed,
	expectDatepickerToBeOpen,
	openDatepicker,
	rightClickOutside,
	selectAutoClose,
	selectDisplayMonths,
} from './datepicker-autoclose.po';
import { clickOnDay, rightClickOnDay } from '../datepicker.po';

test.use({ testURL: 'datepicker/autoclose', testSelector: 'h3:text("Datepicker autoclose")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Datepicker Autoclose', () => {
	for (const displayMonths of [1, 2]) {
		test.describe(`displayMonths = ${displayMonths}`, () => {
			test.beforeEach(async () => {
				await selectDisplayMonths(displayMonths);
			});

			const DATE_SELECT = new Date(2018, 7, 1);
			const DATE_OUTSIDE_BEFORE = new Date(2018, 6, 31);
			const DATE_OUTSIDE_AFTER = displayMonths === 1 ? new Date(2018, 6, 31) : new Date(2018, 9, 1);

			test(`should not close when right clicking`, async () => {
				await selectAutoClose('true');
				await openDatepicker(`Opening datepicker for right click test`);
				await rightClickOnDay(DATE_SELECT);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on right click inside`);
				await rightClickOutside();
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on right click outside`);
			});

			test(`should work when autoClose === true`, async () => {
				await selectAutoClose('true');

				// escape
				await openDatepicker(`Opening datepicker for escape`);
				await getPage().keyboard.press('Escape');
				await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

				// outside click
				await openDatepicker(`Opening datepicker for outside click`);
				await clickOutside();
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside click`);

				// date selection
				await openDatepicker(`Opening datepicker for date selection`);
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeClosed(`Datepicker should be closed on date selection`);

				// outside days click -> month before
				await openDatepicker(`Opening datepicker for outside days click -> month before`);
				await clickOnDay(DATE_OUTSIDE_BEFORE);
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);

				// outside days click -> month after
				await openDatepicker(`Opening datepicker for outside days click -> month after`);
				await clickOnDay(DATE_OUTSIDE_AFTER);
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);
			});

			test(`should work when autoClose === false`, async () => {
				await selectAutoClose('false');

				// escape
				await openDatepicker(`Opening datepicker`);
				await sendKey('Escape');
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on ESC`);

				// outside click
				await clickOutside();
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside click`);

				// date selection
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on date selection`);

				// outside days click -> month before
				await clickOnDay(DATE_OUTSIDE_BEFORE);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);

				// outside days click -> month after
				await closeDatepicker(`Closing datepicker`);
				await openDatepicker(`Reopening datepicker`); // to reset visible month
				await clickOnDay(DATE_OUTSIDE_AFTER);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);
			});

			test(`should work when autoClose === 'outside'`, async () => {
				await selectAutoClose('outside');

				// escape
				await openDatepicker(`Opening datepicker for escape`);
				await sendKey('Escape');
				await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

				// outside click
				await openDatepicker(`Opening datepicker for outside click`);
				await clickOutside();
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside click`);

				// date selection
				await openDatepicker(`Opening datepicker for date selection`);
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on date selection`);

				// outside days click -> month before
				await clickOnDay(DATE_OUTSIDE_BEFORE);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);

				// outside days click -> month after
				await closeDatepicker(`Closing datepicker`);
				await openDatepicker(`Reopening datepicker`); // to reset visible month
				await clickOnDay(DATE_OUTSIDE_AFTER);
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);
			});

			test(`should work when autoClose === 'inside'`, async () => {
				await selectAutoClose('inside');

				// escape
				await openDatepicker(`Opening datepicker for escape`);
				await sendKey('Escape');
				await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

				// outside click
				await openDatepicker(`Opening datepicker for outside click`);
				await clickOutside();
				await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside click`);

				// date selection
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeClosed(`Datepicker should be closed on date selection`);

				// outside days click -> month before
				await openDatepicker(`Opening datepicker for outside days click -> month before`);
				await clickOnDay(DATE_OUTSIDE_BEFORE);
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);

				// outside days click -> month after
				await openDatepicker(`Opening datepicker for outside days click -> month after`);
				await clickOnDay(DATE_OUTSIDE_AFTER);
				await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);
			});
			test(`should change autoClose setting dynamically`, async () => {
				// initially set autoClose to 'inside' because selectAutoClose is an outside click
				await selectAutoClose('inside');
				await openDatepicker(`Open datepicker with autoclose 'inside'`);

				// change autoClose to false whilst open
				await selectAutoClose('false');
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeOpen(`Datepicker should not close after autoClose is changed to false whilst open`);

				// change autoClose to 'inside' whilst open
				await selectAutoClose('inside');
				await clickOnDay(DATE_SELECT);
				await expectDatepickerToBeClosed(`Datepicker should close after autoClose is changed to 'inside' whilst open`);
			});
		});
	}
});
