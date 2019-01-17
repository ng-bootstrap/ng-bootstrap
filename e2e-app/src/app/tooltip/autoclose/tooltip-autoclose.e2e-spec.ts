import {Key} from 'protractor';
import {sendKey, openUrl} from '../../tools.po';
import {TooltipAutoClosePage} from './tooltip-autoclose.po';

describe('Tooltip Autoclose', () => {
  let page: TooltipAutoClosePage;

  const expectTooltipToBeOpen = async(message: string) => {
    expect(await page.getTooltip().isPresent()).toBeTruthy(message);
    expect(await page.getOpenStatus().getText()).toBe('open', message);
  };

  const expectTooltipToBeClosed = async(message: string) => {
    expect(await page.getTooltip().isPresent()).toBeFalsy(message);
    expect(await page.getOpenStatus().getText()).toBe('closed', message);
  };

  const openTooltip = async(message: string) => {
    await page.openTooltip();
    await expectTooltipToBeOpen(message);
  };

  beforeAll(() => page = new TooltipAutoClosePage());

  beforeEach(async() => await openUrl('tooltip/autoclose'));

  it(`should work when autoClose === true`, async() => {
    await page.selectAutoClose('true');

    // escape
    await openTooltip(`Opening tooltip for escape`);
    await sendKey(Key.ESCAPE);
    await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

    // outside click
    await openTooltip(`Opening tooltip for outside click`);
    await page.clickOutside();
    await expectTooltipToBeClosed(`Tooltip should be closed on outside click`);

    // inside click
    await openTooltip(`Opening tooltip for inside click`);
    await page.getTooltipContent().click();
    await expectTooltipToBeClosed(`Tooltip should be closed on date selection`);
  });

  it(`should work when autoClose === false`, async() => {
    await page.selectAutoClose('false');

    // escape
    await openTooltip(`Opening tooltip for escape`);
    await sendKey(Key.ESCAPE);
    await expectTooltipToBeOpen(`Tooltip should NOT be closed on ESC`);

    // outside click
    await page.clickOutside();
    await expectTooltipToBeOpen(`Tooltip should NOT be closed on outside click`);

    // inside click
    await page.getTooltipContent().click();
    await expectTooltipToBeOpen(`Tooltip should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'outside'`, async() => {
    await page.selectAutoClose('outside');

    // escape
    await openTooltip(`Opening tooltip for escape`);
    await sendKey(Key.ESCAPE);
    await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

    // outside click
    await openTooltip(`Opening tooltip for outside click`);
    await page.clickOutside();
    await expectTooltipToBeClosed(`Tooltip should be closed on outside click`);

    // date selection
    await openTooltip(`Opening tooltip for date selection`);
    await page.getTooltipContent().click();
    await expectTooltipToBeOpen(`Tooltip should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'inside'`, async() => {
    await page.selectAutoClose('inside');

    // escape
    await openTooltip(`Opening tooltip for escape`);
    await sendKey(Key.ESCAPE);
    await expectTooltipToBeClosed(`Tooltip should be closed on ESC`);

    // outside click
    await openTooltip(`Opening tooltip for outside click`);
    await page.clickOutside();
    await expectTooltipToBeOpen(`Tooltip should NOT be closed on outside click`);

    // date selection
    await page.getTooltipContent().click();
    await expectTooltipToBeClosed(`Tooltip should be closed on date selection`);
  });
});
