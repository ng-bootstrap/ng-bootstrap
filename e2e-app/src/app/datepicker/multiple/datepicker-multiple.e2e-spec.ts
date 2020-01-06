import {Key} from 'protractor';
import {sendKey, openUrl} from '../../tools.po';
import {DatepickerMultiplePage} from './datepicker-multiple.po';

describe('Datepicker multiple instances', () => {
  let page: DatepickerMultiplePage;

  beforeAll(() => page = new DatepickerMultiplePage());

  beforeEach(async() => await openUrl('datepicker/multiple'));

  it('the instance tapped should gain focus', async() => {
    const dp1 = await page.getDatepicker('#dp1');
    const dp2 = await page.getDatepicker('#dp2');
    await page.getDayElement(new Date(2016, 7, 1), dp1).click();
    await sendKey(Key.ARROW_DOWN);
    await page.expectActive(new Date(2016, 7, 8), dp1);
    await page.getDayElement(new Date(2016, 7, 1), dp2).click();
    await sendKey(Key.ARROW_DOWN);
    await page.expectActive(new Date(2016, 7, 8), dp2);
  });
});
