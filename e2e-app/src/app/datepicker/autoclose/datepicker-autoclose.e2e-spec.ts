import {Key} from 'protractor';
import {DatepickerAutoClosePage} from './datepicker-autoclose.po';
import {openUrl, sendKey} from '../../tools.po';

describe('Datepicker Autoclose', () => {
  let page: DatepickerAutoClosePage;

  beforeAll(() => page = new DatepickerAutoClosePage());

  beforeEach(async() => await openUrl('datepicker/autoclose'));

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
    await page.getDayElement(new Date()).click();
    expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on date selection`);
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
    await page.getDayElement(new Date()).click();
    expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on date selection`);
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
    await page.getDayElement(new Date()).click();
    expect(await page.getDatepicker().isPresent()).toBeTruthy(`Datepicker should NOT be closed on date selection`);
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
    await page.getDayElement(new Date()).click();
    expect(await page.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed on date selection`);
  });
});
