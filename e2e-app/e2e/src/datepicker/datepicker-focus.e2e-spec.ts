import {$, Key} from 'protractor';
import {expectFocused, sendKey, openUrl} from '../tools';
import {DatepickerFocusPage} from './datepicker-focus.po';

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

describe('Datepicker', () => {
  let page: DatepickerFocusPage;

  beforeAll(() => page = new DatepickerFocusPage());

  beforeEach(async() => await openUrl('datepicker/focus'));

  it(`should not be present on the page initially`,
     async() => { expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed initially`); });

  it(`should focus today when opened`, async() => {
    await page.openDatepicker();
    await expectFocused(page.getToday(), `Today's date should be focused`);
  });

  it(`should focus selected day when opened`, async() => {
    await page.preSelectDate();  // 10 AUG 2018
    await page.openDatepicker();
    await expectFocused(page.getDayElement(new Date(2018, 7, 10)), `Selected date should be focused`);
  });

  it(`should focus 1st day of {year, month} startDate day when opened`, async() => {
    await page.selectStartDate('month-only');  // startDate = AUG 2018
    await page.openDatepicker();
    await expectFocused(page.getDayElement(new Date(2018, 7, 1)), `First day of startDate should be focused`);
  });

  it(`should focus {year, month, day} startDate day when opened`, async() => {
    await page.selectStartDate('month-and-day');  // startDate = 10 AUG 2018
    await page.openDatepicker();
    await expectFocused(page.getDayElement(new Date(2018, 7, 10)), `First day of startDate should be focused`);
  });

  it(`should be closed on toggle element click and focus it`, async() => {
    await page.openDatepicker();

    // close
    await page.getToggle().click();
    expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should not be present on the page`);

    // check toggle is focused
    await expectFocused(page.getToggle(), `Toggle element should stay focused after datepicker is closed`);
  });

  it(`should be closed on Escape and focus nothing`, async() => {
    await page.openDatepicker();

    // close
    await sendKey(Key.ESCAPE);
    expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should not be present on the page`);

    // check nothing is focused
    await expectFocused($('body'), `Nothing should be focused after datepicker is closed`);

    // tab should focus toggling element
    await sendKey(Key.TAB);
    await expectFocused(page.getToggle(), `Toggle element should become focused on Tab press`);
  });

  it(`should be closed on date selection and focus nothing`, async() => {
    await page.openDatepicker();

    // close
    await page.getToday().click();
    expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should not be present on the page`);

    // check nothing is focused
    await expectFocused($('body'), `Nothing should be focused after datepicker is closed`);

    // tab should focus toggling element
    await sendKey(Key.TAB);
    await expectFocused(page.getToggle(), `Toggle element should become focused on Tab press`);
  });

  it(`should trap focus inside opened popup (Tab)`, async() => {
    await page.openDatepicker();

    // today -> prev. month -> month -> year -> next month -> today -> ...
    await expectFocused(page.getToday(), `Today's date should be focused`);

    await sendKey(Key.TAB);
    await expectFocused(page.getPrevMonthArrow(), `Previous Month arrow should be focused`);

    await sendKey(Key.TAB);
    await expectFocused(page.getMonthSelect(), `Month select box should be focused`);

    await sendKey(Key.TAB);
    await expectFocused(page.getYearSelect(), `Year select box should be focused`);

    await sendKey(Key.TAB);
    await expectFocused(page.getNextMonthArrow(), `Next Month arrow should be focused`);

    await sendKey(Key.TAB);
    await expectFocused(page.getToday(), `Today's date should be focused`);
  });

  it(`should trap focus inside opened popup with (Shift+Tab)`, async() => {
    await page.openDatepicker();

    // today -> next month -> year -> month -> prev. month -> today -> ...
    await expectFocused(page.getToday(), `Today's date should be focused`);

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getNextMonthArrow(), `Next Month arrow should be focused`);

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getYearSelect(), `Year select box should be focused`);

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getMonthSelect(), `Month select box should be focused`);

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getPrevMonthArrow(), `Previous Month arrow should be focused`);

    await sendKey(Key.SHIFT, Key.TAB);
    await expectFocused(page.getToday(), `Today's date should be focused`);
  });

  it(`should change month on click and keep 'next' arrow focused`, async() => {
    await page.openDatepicker();
    const nextMonth = page.getNextMonthArrow();

    // first date of current month
    const firstDate = getFirstOfMonth(new Date());
    expect(await page.getDayElement(firstDate).isPresent())
        .toBeTruthy(`First date of current month should be displayed`);

    // skipping one months
    await nextMonth.click();
    await expectFocused(nextMonth, `Next month arrow should be focused`);

    // make sure we changed month
    expect(await page.getDayElement(firstDate).isPresent())
        .toBeFalsy(`First date of current month should NOT be displayed`);
  });

  it(`should change month on click and keep 'prev' arrow focused`, async() => {
    await page.openDatepicker();
    const prevMonth = page.getPrevMonthArrow();

    // last date of current month
    const lastDate = getLastOfMonth(new Date());
    expect(await page.getDayElement(lastDate).isPresent()).toBeTruthy(`Last date of current month should be displayed`);

    // focus next month
    await prevMonth.click();
    await expectFocused(prevMonth, `Previous month arrow should be focused`);

    expect(await page.getDayElement(lastDate).isPresent())
        .toBeFalsy(`Last date of current month should NOT be displayed`);
  });

  it(`should re-focus current element after inside click`, async() => {
    await page.openDatepicker();

    // click on weekday header
    await page.getWeekdayElements().first().click();
    await expectFocused(page.getToday(), `Today's date should stay focused`);
  });

  it(`should allow focusing datepicker input`, async() => {
    await page.openDatepicker();
    const datepickerInput = page.getDatepickerInput();

    // focus input
    await datepickerInput.click();
    await expectFocused(datepickerInput, `Datepicker input should be focused`);

    // tab should go back to datepicker
    await sendKey(Key.TAB);
    await expectFocused(page.getPrevMonthArrow(), `Previous Month arrow should be focused`);
  });

  describe('Keyboard', () => {

    it(`should handle focus correctly when months are changed with keyboard`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await expectFocused(page.getDayElement(new Date(2018, 7, 10)), `10 AUG should be focused`);

      await sendKey(Key.ARROW_UP);
      await expectFocused(page.getDayElement(new Date(2018, 7, 3)), `03 AUG should be focused`);

      await sendKey(Key.ARROW_UP);
      await expectFocused(page.getDayElement(new Date(2018, 6, 27)), `27 JUL should be focused`);

      await sendKey(Key.ARROW_DOWN);
      await expectFocused(page.getDayElement(new Date(2018, 7, 3)), `03 AUG should be focused`);
    });

    it(`should focus previous day with 'ArrowLeft'`, async() => {
      await page.openDatepicker();

      const yesterday = new Date();
      yesterday.setDate(new Date().getDate() - 1);

      await sendKey(Key.ARROW_LEFT);
      await expectFocused(page.getDayElement(yesterday), `Yesterday should be focused`);
    });

    it(`should focus next day with 'ArrowRight'`, async() => {
      await page.openDatepicker();

      const tomorrow = new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      await sendKey(Key.ARROW_RIGHT);
      await expectFocused(page.getDayElement(tomorrow), `Tomorrow should be focused`);
    });

    it(`should focus previous week with 'ArrowUp'`, async() => {
      await page.openDatepicker();

      const previousWeek = new Date();
      previousWeek.setDate(new Date().getDate() - 7);

      await sendKey(Key.ARROW_UP);
      await expectFocused(page.getDayElement(previousWeek), `Today-7 days should be focused`);
    });

    it(`should focus next week with 'ArrowDown'`, async() => {
      await page.openDatepicker();

      const nextWeek = new Date();
      nextWeek.setDate(new Date().getDate() + 7);

      await sendKey(Key.ARROW_DOWN);
      await expectFocused(page.getDayElement(nextWeek), `Today+7 days should be focused`);
    });

    it(`should focus first day of month with 'Home'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.HOME);
      await expectFocused(page.getDayElement(new Date(2018, 7, 1)), `First day of month should be focused`);
    });

    it(`should focus last day of month with 'End'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.END);
      await expectFocused(page.getDayElement(new Date(2018, 7, 31)), `Last day of month should be focused`);
    });

    it(`should focus first day of previous month with 'PageUp'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.PAGE_UP);
      await expectFocused(page.getDayElement(new Date(2018, 6, 1)), `First day of previous month should be focused`);
    });

    it(`should focus first day of next month with 'PageDown'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.PAGE_DOWN);
      await expectFocused(page.getDayElement(new Date(2018, 8, 1)), `First day of next month should be focused`);
    });

    it(`should focus first day of previous year with 'Shift+PageUp'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.SHIFT, Key.PAGE_UP);
      await expectFocused(page.getDayElement(new Date(2017, 0, 1)), `First day of previous year should be focused`);
    });

    it(`should focus first day of next year with 'Shift+PageDown'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.SHIFT, Key.PAGE_DOWN);
      await expectFocused(page.getDayElement(new Date(2019, 0, 1)), `First day of next year should be focused`);
    });

    it(`should focus min available day with 'Shift+Home'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.SHIFT, Key.HOME);
      await expectFocused(page.getDayElement(new Date(2000, 0, 1)), `Min available day should be focused`);
    });

    it(`should focus max available day with 'Shift+End'`, async() => {
      await page.preSelectDate();  // 10 AUG 2018
      await page.openDatepicker();

      await sendKey(Key.SHIFT, Key.END);
      await expectFocused(page.getDayElement(new Date(2100, 0, 1)), `Max available day should be focused`);
    });
  });
});
