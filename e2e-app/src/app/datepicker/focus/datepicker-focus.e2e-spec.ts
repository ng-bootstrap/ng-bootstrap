import { expect } from '@playwright/test';
import { test, getPage, setPage } from '../../../../baseTest';
import { sendKey } from '../../tools.po';
import {
	openDatepicker,
	SELECTOR_DATEPICKER,
	SELECTOR_DATEPICKER_INPUT,
	SELECTOR_DAY,
	SELECTOR_FIRST_WEEKDAY,
	SELECTOR_MONTH_SELECT,
	SELECTOR_NEXT_MONTH,
	SELECTOR_PREV_MONTH,
	SELECTOR_TOGGLE,
	SELECTOR_YEAR_SELECT,
} from '../datepicker.po';

const getFirstOfMonth = (date: Date) => {
	const first = new Date(date);
	first.setDate(1);
	return first;
};

const getLastOfMonth = (date: Date) => {
	const last = getFirstOfMonth(date);
	last.setMonth(last.getMonth() + 1);
	last.setDate(0);
	return last;
};

const preSelectDate = async () => await getPage().click('#selectDate');

const selectStartDate = async (type: string) => {
	await getPage().click('#start-date-dropdown');
	await getPage().click(`#start-date-${type}`);
};

const disableDatepicker = async () => await getPage().click('#disable');

test.use({ testURL: 'datepicker/focus', testSelector: 'h3:text("Datepicker focus")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe('Datepicker', () => {
	test(`should not be present on the page initially`, async () => {
		await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });
	});

	test(`should focus today when opened`, async () => {
		await openDatepicker();
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should be focused`).toBeFocused();
	});

	test(`should focus selected day when opened`, async () => {
		await preSelectDate(); // 10 AUG 2018
		await openDatepicker();
		await expect(
			getPage().locator(SELECTOR_DAY(new Date(2018, 7, 10))),
			`Selected date should be focused`,
		).toBeFocused();
	});

	test(`should focus 1st day of {year, month} startDate day when opened`, async () => {
		await selectStartDate('month-only'); // startDate = AUG 2018
		await openDatepicker();
		await expect(
			getPage().locator(SELECTOR_DAY(new Date(2018, 7, 1))),
			`First day of startDate should be focused`,
		).toBeFocused();
	});

	test(`should focus {year, month, day} startDate day when opened`, async () => {
		await selectStartDate('month-and-day'); // startDate = 10 AUG 2018
		await openDatepicker();
		await expect(
			getPage().locator(SELECTOR_DAY(new Date(2018, 7, 10))),
			`First day of startDate should be focused`,
		).toBeFocused();
	});

	test(`should be closed on toggle element click and focus it`, async () => {
		await openDatepicker();

		// close
		await getPage().click(SELECTOR_TOGGLE);
		await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });

		// check toggle is focused
		await expect(
			getPage().locator(SELECTOR_TOGGLE),
			`Toggle element should stay focused after datepicker is closed`,
		).toBeFocused();
	});

	test(`should be closed on Escape and re-focus toggle element`, async () => {
		await openDatepicker();

		// close
		await sendKey('Escape');
		await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });

		// check toggle is focused
		await expect(
			getPage().locator(SELECTOR_TOGGLE),
			`Toggle element become re-focused after datepicker is closed`,
		).toBeFocused();
	});

	test(`should be closed on date selection and re-focus toggle element`, async () => {
		await openDatepicker();

		// close
		await getPage().click(SELECTOR_DAY(new Date()));
		await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });

		// check toggle is focused
		await expect(
			getPage().locator(SELECTOR_TOGGLE),
			`Toggle element become re-focused after datepicker is closed`,
		).toBeFocused();
	});

	test(`should trap focus inside opened popup (Tab)`, async ({ browserName }) => {
		test.skip(browserName === 'webkit');

		await openDatepicker();

		// today -> prev. month -> month -> year -> next month -> today -> ...
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should be focused`).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_PREV_MONTH), `Previous Month arrow should be focused`).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_MONTH_SELECT), `Month select box should be focused`).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_YEAR_SELECT), `Year select box should be focused`).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_NEXT_MONTH), `Next Month arrow should be focused`).toBeFocused();

		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should be focused`).toBeFocused();
	});

	test(`should trap focus inside opened popup with (Shift+Tab)`, async ({ browserName }) => {
		test.skip(browserName === 'webkit');

		await openDatepicker();

		// today -> next month -> year -> month -> prev. month -> today -> ...
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should be focused`).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_NEXT_MONTH), `Next Month arrow should be focused`).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_YEAR_SELECT), `Year select box should be focused`).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_MONTH_SELECT), `Month select box should be focused`).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_PREV_MONTH), `Previous Month arrow should be focused`).toBeFocused();

		await sendKey('Shift+Tab');
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should be focused`).toBeFocused();
	});

	test(`should change month on click and keep 'next' arrow focused`, async () => {
		await openDatepicker();

		// first date of current month
		const firstDate = getFirstOfMonth(new Date());
		await getPage().waitForSelector(SELECTOR_DAY(firstDate));

		// skipping one months
		await getPage().click(SELECTOR_NEXT_MONTH);
		await expect(getPage().locator(SELECTOR_NEXT_MONTH), `Next month arrow should be focused`).toBeFocused();

		// make sure we changed month
		await getPage().waitForSelector(SELECTOR_DAY(firstDate), { state: 'detached' });
	});

	test(`should change month on click and keep 'prev' arrow focused`, async () => {
		await openDatepicker();

		// last date of current month
		const lastDate = getLastOfMonth(new Date());
		await getPage().waitForSelector(SELECTOR_DAY(lastDate));

		// focus next month
		await getPage().click(SELECTOR_PREV_MONTH);
		await expect(getPage().locator(SELECTOR_PREV_MONTH), `Previous month arrow should be focused`).toBeFocused();

		await getPage().waitForSelector(SELECTOR_DAY(lastDate), { state: 'detached' });
	});

	test(`should re-focus current element after inside click`, async () => {
		await openDatepicker();

		// click on weekday header
		await getPage().click(SELECTOR_FIRST_WEEKDAY);
		await expect(getPage().locator(SELECTOR_DAY(new Date())), `Today's date should stay focused`).toBeFocused();
	});

	test(`should allow focusing datepicker input`, async ({ browserName }) => {
		test.skip(browserName === 'webkit');
		await openDatepicker();

		// focus input
		await getPage().click(SELECTOR_DATEPICKER_INPUT);
		await expect(getPage().locator(SELECTOR_DATEPICKER_INPUT), `Datepicker input should be focused`).toBeFocused();

		// tab should go back to datepicker
		await sendKey('Tab');
		await expect(getPage().locator(SELECTOR_PREV_MONTH), `Previous Month arrow should be focused`).toBeFocused();
	});

	test(`should be closed on Escape from input and keep focus`, async () => {
		await openDatepicker();

		// focus input
		await getPage().click(SELECTOR_DATEPICKER_INPUT);
		await expect(getPage().locator(SELECTOR_DATEPICKER_INPUT), `Datepicker input should be focused`).toBeFocused();

		// close
		await sendKey('Escape');
		await getPage().waitForSelector(SELECTOR_DATEPICKER, { state: 'detached' });

		// check input is still focused
		await expect(
			getPage().locator(SELECTOR_DATEPICKER_INPUT),
			`Input element should stay focused after datepicker is closed`,
		).toBeFocused();
	});

	test(`should not allow any interactions when disabled`, async () => {
		await disableDatepicker();
		await preSelectDate(); // 10 AUG 2018
		await openDatepicker();

		await expect(getPage().locator(SELECTOR_TOGGLE), `Toggling element should stay focused`).toBeFocused();

		const dayElement = SELECTOR_DAY(new Date(2018, 7, 10));
		await getPage().waitForSelector(dayElement);
		let message = '';
		try {
			await getPage().click(dayElement, { timeout: 500 });
		} catch (e) {
			message = e.message;
		}
		expect(message).toContain('intercepts pointer events');
	});

	test.describe('Keyboard', () => {
		test(`should handle focus correctly when months are changed with keyboard`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await expect(getPage().locator(SELECTOR_DAY(new Date(2018, 7, 10))), `10 AUG should be focused`).toBeFocused();

			await sendKey('ArrowUp');
			await expect(getPage().locator(SELECTOR_DAY(new Date(2018, 7, 3))), `03 AUG should be focused`).toBeFocused();

			await sendKey('ArrowUp');
			await expect(getPage().locator(SELECTOR_DAY(new Date(2018, 6, 27))), `27 JUL should be focused`).toBeFocused();

			await sendKey('ArrowDown');
			await expect(getPage().locator(SELECTOR_DAY(new Date(2018, 7, 3))), `03 AUG should be focused`).toBeFocused();
		});

		test(`should focus previous day with 'ArrowLeft'`, async () => {
			await openDatepicker();

			const yesterday = new Date();
			yesterday.setDate(new Date().getDate() - 1);

			await sendKey('ArrowLeft');
			await expect(getPage().locator(SELECTOR_DAY(yesterday)), `Yesterday should be focused`).toBeFocused();
		});

		test(`should focus next day with 'ArrowRight'`, async () => {
			await openDatepicker();

			const tomorrow = new Date();
			tomorrow.setDate(new Date().getDate() + 1);

			await sendKey('ArrowRight');
			await expect(getPage().locator(SELECTOR_DAY(tomorrow)), `Tomorrow should be focused`).toBeFocused();
		});

		test(`should focus previous week with 'ArrowUp'`, async () => {
			await openDatepicker();

			const previousWeek = new Date();
			previousWeek.setDate(new Date().getDate() - 7);

			await sendKey('ArrowUp');
			await expect(getPage().locator(SELECTOR_DAY(previousWeek)), `Today-7 days should be focused`).toBeFocused();
		});

		test(`should focus next week with 'ArrowDown'`, async () => {
			await openDatepicker();

			const nextWeek = new Date();
			nextWeek.setDate(new Date().getDate() + 7);

			await sendKey('ArrowDown');
			await expect(getPage().locator(SELECTOR_DAY(nextWeek)), `Today+7 days should be focused`).toBeFocused();
		});

		test(`should focus first day of month with 'Home'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('Home');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2018, 7, 1))),
				`First day of month should be focused`,
			).toBeFocused();
		});

		test(`should focus last day of month with 'End'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('End');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2018, 7, 31))),
				`Last day of month should be focused`,
			).toBeFocused();
		});

		test(`should focus same day of previous month with 'PageUp'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('PageUp');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2018, 6, 10))),
				`Same day of previous month should be focused`,
			).toBeFocused();
		});

		test(`should focus same day of next month with 'PageDown'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('PageDown');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2018, 8, 10))),
				`Same day of next month should be focused`,
			).toBeFocused();
		});

		test(`should focus same day of previous year with 'Shift+PageUp'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('Shift+PageUp');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2017, 7, 10))),
				`Same day of previous year should be focused`,
			).toBeFocused();
		});

		test(`should focus same day of next year with 'Shift+PageDown'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('Shift+PageDown');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2019, 7, 10))),
				`Same day of next year should be focused`,
			).toBeFocused();
		});

		test(`should focus min available day with 'Shift+Home'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('Shift+Home');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2000, 0, 1))),
				`Min available day should be focused`,
			).toBeFocused();
		});

		test(`should focus max available day with 'Shift+End'`, async () => {
			await preSelectDate(); // 10 AUG 2018
			await openDatepicker();

			await sendKey('Shift+End');
			await expect(
				getPage().locator(SELECTOR_DAY(new Date(2100, 0, 1))),
				`Max available day should be focused`,
			).toBeFocused();
		});
	});
});
