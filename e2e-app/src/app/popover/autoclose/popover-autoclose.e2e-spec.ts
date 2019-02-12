import {Key} from 'protractor';
import {sendKey, openUrl, rightClick} from '../../tools.po';
import {PopoverAutoClosePage} from './popover-autoclose.po';

describe('Popover Autoclose', () => {
  let page: PopoverAutoClosePage;

  const expectPopoverToBeOpen = async(message: string) => {
    expect(await page.getPopover().isPresent()).toBeTruthy(message);
    expect(await page.getOpenStatus().getText()).toBe('open', message);
  };

  const expectPopoverToBeClosed = async(message: string) => {
    expect(await page.getPopover().isPresent()).toBeFalsy(message);
    expect(await page.getOpenStatus().getText()).toBe('closed', message);
  };

  const openPopover = async(message: string) => {
    await page.openPopover();
    await expectPopoverToBeOpen(message);
  };

  beforeAll(() => page = new PopoverAutoClosePage());

  beforeEach(async() => await openUrl('popover/autoclose'));

  it(`should not close popover on right clicks`, async() => {
    await openPopover(`Opening popover for right clicks`);

    await rightClick(page.getPopoverContent());
    await expectPopoverToBeOpen(`Popover should stay visible when right-clicking inside`);

    await page.rightClickOutside();
    await expectPopoverToBeOpen(`Popover should stay visible when right-clicking outside`);
  });

  it(`should work when autoClose === true`, async() => {
    await page.selectAutoClose('true');

    // escape
    await openPopover(`Opening popover for escape`);
    await sendKey(Key.ESCAPE);
    await expectPopoverToBeClosed(`Popover should be closed on ESC`);

    // outside click
    await openPopover(`Opening popover for outside click`);
    await page.clickOutside();
    await expectPopoverToBeClosed(`Popover should be closed on outside click`);

    // inside click
    await openPopover(`Opening popover for inside click`);
    await page.getPopoverContent().click();
    await expectPopoverToBeClosed(`Popover should be closed on inside click`);
  });

  it(`should work when autoClose === false`, async() => {
    await page.selectAutoClose('false');

    // escape
    await openPopover(`Opening popover for escape`);
    await sendKey(Key.ESCAPE);
    await expectPopoverToBeOpen(`Popover should NOT be closed on ESC`);

    // outside click
    await page.clickOutside();
    await expectPopoverToBeOpen(`Popover should NOT be closed on outside click`);

    // inside click
    await page.getPopoverContent().click();
    await expectPopoverToBeOpen(`Popover should NOT be closed on inside click`);
  });

  it(`should work when autoClose === 'outside'`, async() => {
    await page.selectAutoClose('outside');

    // escape
    await openPopover(`Opening popover for escape`);
    await sendKey(Key.ESCAPE);
    await expectPopoverToBeClosed(`Popover should be closed on ESC`);

    // outside click
    await openPopover(`Opening popover for outside click`);
    await page.clickOutside();
    await expectPopoverToBeClosed(`Popover should be closed on outside click`);

    // inside click
    await openPopover(`Opening popover for inside click`);
    await page.getPopoverContent().click();
    await expectPopoverToBeOpen(`Popover should NOT be closed on inside click`);
  });

  it(`should work when autoClose === 'inside'`, async() => {
    await page.selectAutoClose('inside');

    // escape
    await openPopover(`Opening popover for escape`);
    await sendKey(Key.ESCAPE);
    await expectPopoverToBeClosed(`Popover should be closed on ESC`);

    // outside click
    await openPopover(`Opening popover for outside click`);
    await page.clickOutside();
    await expectPopoverToBeOpen(`Popover should NOT be closed on outside click`);

    // inside click
    await page.getPopoverContent().click();
    await expectPopoverToBeClosed(`Popover should be closed on inside click`);
  });
});
