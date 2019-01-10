import {Key} from 'protractor';
import {DatepickerAutoClosePage} from './datepicker-autoclose.po';
import {openUrl, sendKey} from '../../tools.po';

describe('Datepicker Autoclose', () => {
  let page: DatepickerAutoClosePage;

  beforeAll(() => page = new DatepickerAutoClosePage());

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
        await page.openDatepicker();
        await sendKey(Key.ESCAPE);
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on ESC`);

        // outside click
        await page.openDatepicker();
        await page.clickOutside();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside click`);

        // date selection
        await page.openDatepicker();
        await page.getDayElement(DATE_SELECT).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on date selection`);

        // outside days click -> month before
        await page.openDatepicker();
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside day click`);

        // outside days click -> month after
        await page.openDatepicker();
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside day click`);
      });

      it(`should work when autoClose === false`, async() => {
        await page.selectAutoClose('false');

        // escape
        await page.openDatepicker();
        await sendKey(Key.ESCAPE);
        expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on ESC`);

        // outside click
        await page.clickOutside();
        expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on outside click`);

        // date selection
        await page.getDayElement(DATE_SELECT).click();
        expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on date selection`);

        // outside days click -> month before
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        expect(await page.getDatepicker().isPresent())
            .toBeTruthy(`Datepicker should NOT be closed on outside day click`);

        // outside days click -> month after
        await page.closeDatepicker();
        await page.openDatepicker();  // to reset visible month
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        expect(await page.getDatepicker().isPresent())
            .toBeTruthy(`Datepicker should NOT be closed on outside day click`);
      });

      it(`should work when autoClose === 'outside'`, async() => {
        await page.selectAutoClose('outside');

        // escape
        await page.openDatepicker();
        await sendKey(Key.ESCAPE);
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on ESC`);

        // outside click
        await page.openDatepicker();
        await page.clickOutside();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside click`);

        // date selection
        await page.openDatepicker();
        await page.getDayElement(DATE_SELECT).click();
        expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on date selection`);

        // outside days click -> month before
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        expect(await page.getDatepicker().isPresent())
            .toBeTruthy(`Datepicker should NOT be closed on outside day click`);

        // outside days click -> month after
        await page.closeDatepicker();
        await page.openDatepicker();  // to reset visible month
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        expect(await page.getDatepicker().isPresent())
            .toBeTruthy(`Datepicker should NOT be closed on outside day click`);
      });

      it(`should work when autoClose === 'inside'`, async() => {
        await page.selectAutoClose('inside');

        // escape
        await page.openDatepicker();
        await sendKey(Key.ESCAPE);
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on ESC`);

        // outside click
        await page.openDatepicker();
        await page.clickOutside();
        expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on outside click`);

        // date selection
        await page.getDayElement(DATE_SELECT).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on date selection`);

        // outside days click -> month before
        await page.openDatepicker();
        await page.getDayElement(DATE_OUTSIDE_BEFORE).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside day click`);

        // outside days click -> month after
        await page.openDatepicker();
        await page.getDayElement(DATE_OUTSIDE_AFTER).click();
        expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on outside day click`);
      });
    });
  }
});
