import {browser, Key} from 'protractor';
import {sendKey} from '../tools';
import {TooltipAutoClosePage} from './tooltip-autoclose.po';

describe('Tooltip Autoclose', () => {
  let page: TooltipAutoClosePage;

  beforeAll(async () => {
    page = new TooltipAutoClosePage();
    await browser.get('#/tooltip/autoclose');
  });

  beforeEach(async () => await page.reset());

  it(`should work when autoClose === true`, async () => {
    await page.selectAutoClose('true');

    // escape
    await page.openTooltip();
    await sendKey(Key.ESCAPE);
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on ESC`);

    // outside click
    await page.openTooltip();
    await page.clickOutside();
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on outside click`);

    // inside click
    await page.openTooltip();
    await page.getTooltipContent().click();
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on date selection`);
  });

  it(`should work when autoClose === false`, async () => {
    await page.selectAutoClose('false');

    // escape
    await page.openTooltip();
    await sendKey(Key.ESCAPE);
    expect(await page.getTooltip().isPresent()).toBeTruthy(`Tooltip should NOT be closed on ESC`);

    // outside click
    await page.clickOutside();
    expect(await page.getTooltip().isPresent()).toBeTruthy(`Tooltip should NOT be closed on outside click`);

    // inside click
    await page.getTooltipContent().click();
    expect(await page.getTooltip().isPresent()).toBeTruthy(`Tooltip should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'outside'`, async () => {
    await page.selectAutoClose('outside');

    // escape
    await page.openTooltip();
    await sendKey(Key.ESCAPE);
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on ESC`);

    // outside click
    await page.openTooltip();
    await page.clickOutside();
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on outside click`);

    // date selection
    await page.openTooltip();
    await page.getTooltipContent().click();
    expect(await page.getTooltip().isPresent()).toBeTruthy(`Tooltip should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'inside'`, async () => {
    await page.selectAutoClose('inside');

    // escape
    await page.openTooltip();
    await sendKey(Key.ESCAPE);
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on ESC`);

    // outside click
    await page.openTooltip();
    await page.clickOutside();
    expect(await page.getTooltip().isPresent()).toBeTruthy(`Tooltip should NOT be closed on outside click`);

    // date selection
    await page.getTooltipContent().click();
    expect(await page.getTooltip().isPresent()).toBeFalsy(`Tooltip should be closed on date selection`);
  });
});
