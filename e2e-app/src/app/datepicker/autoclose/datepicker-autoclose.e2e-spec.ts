import {Key} from 'protractor';
import {DatepickerAutoClosePage} from './datepicker-autoclose.po';
import {openUrl, sendKey} from '../../tools.po';

describe('Datepicker Autoclose', () => {
  let page: DatepickerAutoClosePage;

  beforeAll(() => page = new DatepickerAutoClosePage());

  const expectDatepickerToBeOpen = async(message: string) => {
    expect(await page.getDatepicker().isPresent()).toBeTruthy(message);
    expect(await page.getOpenStatus().getText()).toBe('open', message);
  };

  const expectDatepickerToBeClosed = async(message: string) => {
    expect(await page.getDatepicker().isPresent()).toBeFalsy(message);
    expect(await page.getOpenStatus().getText()).toBe('closed', message);
  };

  const openDatepicker = async(message: string) => {
    await page.openDatepicker();
    await expectDatepickerToBeOpen(message);
  };

  const closeDatepicker = async(message: string) => {
    await page.closeDatepicker();
    await expectDatepickerToBeClosed(message);
  };

  for (let displayMonths of[1, 2]) {
    describe(`displayMonths = ${displayMonths}`, () => {

      const DATE_SELECT = new Date(2018, 7, 1);
      const DATE_OUTSIDE_BEFORE = new Date(2018, 6, 31);
      const DATE_OUTSIDE_AFTER = displayMonths === 1 ? new Date(2018, 6, 31) : new Date(2018, 9, 1);

      beforeEach(async() => {
        await openUrl('datepicker/autoclose');
        await page.selectDisplayMonths(displayMonths);
      });

      it(`should work when autoClose === true`, async() => {
        await page.selectAutoClose('true');

        // escape
        await openDatepicker(`Opening datepicker for escape`);
        await sendKey(Key.ESCAPE);
        await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

        // outside click
        await openDatepicker(`Opening datepicker for outside click`);
        await page.clickOutside();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside click`);

        // date selection
        await openDatepicker(`Opening datepicker for date selection`);
        await page.getDayElement(DATE_SELECT).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on date selection`);

        // outside days click -> month before
        await openDatepicker(`Opening datepicker for outside days click -> month before`);
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);

        // outside days click -> month after
        await openDatepicker(`Opening datepicker for outside days click -> month after`);
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);
      });

      it(`should work when autoClose === false`, async() => {
        await page.selectAutoClose('false');

        // escape
        await openDatepicker(`Opening datepicker`);
        await sendKey(Key.ESCAPE);
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on ESC`);

        // outside click
        await page.clickOutside();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside click`);

        // date selection
        await page.getDayElement(DATE_SELECT).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on date selection`);

        // outside days click -> month before
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);

        // outside days click -> month after
        await closeDatepicker(`Closing datepicker`);
        await openDatepicker(`Reopening datepicker`);  // to reset visible month
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);
      });

      it(`should work when autoClose === 'outside'`, async() => {
        await page.selectAutoClose('outside');

        // escape
        await openDatepicker(`Opening datepicker for escape`);
        await sendKey(Key.ESCAPE);
        await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

        // outside click
        await openDatepicker(`Opening datepicker for outside click`);
        await page.clickOutside();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside click`);

        // date selection
        await openDatepicker(`Opening datepicker for date selection`);
        await page.getDayElement(DATE_SELECT).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on date selection`);

        // outside days click -> month before
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);

        // outside days click -> month after
        await closeDatepicker(`Closing datepicker`);
        await openDatepicker(`Reopening datepicker`);  // to reset visible month
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside day click`);
      });

      it(`should work when autoClose === 'inside'`, async() => {
        await page.selectAutoClose('inside');

        // escape
        await openDatepicker(`Opening datepicker for escape`);
        await sendKey(Key.ESCAPE);
        await expectDatepickerToBeClosed(`Datepicker should be closed on ESC`);

        // outside click
        await openDatepicker(`Opening datepicker for outside click`);
        await page.clickOutside();
        await expectDatepickerToBeOpen(`Datepicker should NOT be closed on outside click`);

        // date selection
        await page.getDayElement(DATE_SELECT).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on date selection`);

        // outside days click -> month before
        await openDatepicker(`Opening datepicker for outside days click -> month before`);
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);

        // outside days click -> month after
        await openDatepicker(`Opening datepicker for outside days click -> month after`);
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        await expectDatepickerToBeClosed(`Datepicker should be closed on outside day click`);
      });
    });
  }
});
