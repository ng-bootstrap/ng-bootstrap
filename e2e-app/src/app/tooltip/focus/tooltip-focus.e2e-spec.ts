import {openUrl} from '../../tools.po';
import {TooltipFocusPage as TooltipFocusPage} from './tooltip-focus.po';
import {protractor} from 'protractor';

describe('Tooltip Focus', () => {
  let page: TooltipFocusPage;

  const expectTooltipToBeOpen = async(message: string) => {
    expect(await page.getTooltip().isPresent()).toBeTruthy(message);
    expect(await page.getOpenStatus().getText()).toBe('open', message);
  };

  const expectTooltipToBeClosed = async(message: string) => {
    expect(await page.getTooltip().isPresent()).toBeFalsy(message);
    expect(await page.getOpenStatus().getText()).toBe('closed', message);
  };

  beforeAll(() => page = new TooltipFocusPage());

  beforeEach(async() => await openUrl('tooltip/focus'));

  it(`should work when triggers === 'focus'`, async() => {
    // focusin to show
    await page.getButton('before').click();
    await page.getButton('before').sendKeys(protractor.Key.TAB);
    await expectTooltipToBeOpen(`Tooltip should be visible when tooltip button gains focus`);

    // focusout to hide
    await page.getButton('tooltip').sendKeys(protractor.Key.TAB);
    await expectTooltipToBeClosed(`Tooltip should not be visible when tooltip button looses focus`);
  });
});
