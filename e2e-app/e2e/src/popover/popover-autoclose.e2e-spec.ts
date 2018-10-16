import {Key} from 'protractor';
import {sendKey, openUrl} from '../tools';
import {PopoverAutoClosePage} from './popover-autoclose.po';

describe('Popover Autoclose', () => {
  let page: PopoverAutoClosePage;

  beforeAll(() => page = new PopoverAutoClosePage());

  beforeEach(async() => await openUrl('popover/autoclose'));

  it(`should work when autoClose === true`, async() => {
    await page.selectAutoClose('true');

    // escape
    await page.openPopover();
    await sendKey(Key.ESCAPE);
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on ESC`);

    // outside click
    await page.openPopover();
    await page.clickOutside();
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on outside click`);

    // inside click
    await page.openPopover();
    await page.getPopoverContent().click();
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on date selection`);
  });

  it(`should work when autoClose === false`, async() => {
    await page.selectAutoClose('false');

    // escape
    await page.openPopover();
    await sendKey(Key.ESCAPE);
    expect(await page.getPopover().isPresent()).toBeTruthy(`Popover should NOT be closed on ESC`);

    // outside click
    await page.clickOutside();
    expect(await page.getPopover().isPresent()).toBeTruthy(`Popover should NOT be closed on outside click`);

    // inside click
    await page.getPopoverContent().click();
    expect(await page.getPopover().isPresent()).toBeTruthy(`Popover should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'outside'`, async() => {
    await page.selectAutoClose('outside');

    // escape
    await page.openPopover();
    await sendKey(Key.ESCAPE);
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on ESC`);

    // outside click
    await page.openPopover();
    await page.clickOutside();
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on outside click`);

    // date selection
    await page.openPopover();
    await page.getPopoverContent().click();
    expect(await page.getPopover().isPresent()).toBeTruthy(`Popover should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'inside'`, async() => {
    await page.selectAutoClose('inside');

    // escape
    await page.openPopover();
    await sendKey(Key.ESCAPE);
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on ESC`);

    // outside click
    await page.openPopover();
    await page.clickOutside();
    expect(await page.getPopover().isPresent()).toBeTruthy(`Popover should NOT be closed on outside click`);

    // date selection
    await page.getPopoverContent().click();
    expect(await page.getPopover().isPresent()).toBeFalsy(`Popover should be closed on date selection`);
  });
});
