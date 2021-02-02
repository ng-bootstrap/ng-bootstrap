import {sendKey, openUrl, Key, expectFocused} from '../../tools.pw-po';
import {clickOnDay, SELECTOR_DAY} from '../datepicker';
import {test} from '../../../../playwright.conf';

const expectActive = async(selector: string) => {
  await test.page.waitForSelector(selector + ' >> .active');
  await expectFocused(selector, `active date should be focused`);
};

describe('Datepicker multiple instances', () => {

  beforeEach(async() => await openUrl('datepicker/multiple'));

  it('the instance tapped should gain focus', async() => {

    await clickOnDay(new Date(2016, 7, 1), '#dp1');
    await sendKey(Key.ArrowDown);
    await expectActive(SELECTOR_DAY(new Date(2016, 7, 8), '#dp1'));

    await clickOnDay(new Date(2016, 7, 1), '#dp2');
    await sendKey(Key.ArrowDown);
    await expectActive(SELECTOR_DAY(new Date(2016, 7, 8), '#dp2'));
  });
});
