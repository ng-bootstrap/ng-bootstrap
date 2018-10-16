import {Key} from 'protractor';
import {sendKey, openUrl} from '../tools';
import {DropdownAutoClosePage} from './dropdown-autoclose.po';

describe('Dropdown Autoclose', () => {
  let page: DropdownAutoClosePage;

  beforeAll(() => page = new DropdownAutoClosePage());

  beforeEach(async() => await openUrl('dropdown/autoclose'));

  it(`should work when autoClose === true`, async() => {
    await page.selectAutoClose('true');
    const dropdown = page.getDropdown('#dropdown');

    // escape
    await page.open(dropdown);
    await sendKey(Key.ESCAPE);
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on ESC`);

    // outside click
    await page.open(dropdown);
    await page.clickOutside();
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on outside click`);

    // inside click
    await page.open(dropdown);
    await page.getFirstItem(dropdown).click();
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on date selection`);
  });

  it(`should work when autoClose === false`, async() => {
    await page.selectAutoClose('false');
    const dropdown = page.getDropdown('#dropdown');

    // escape
    await page.open(dropdown);
    await sendKey(Key.ESCAPE);
    expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should NOT be closed on ESC`);

    // outside click
    await page.clickOutside();
    expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should NOT be closed on outside click`);

    // inside click
    await page.getFirstItem(dropdown).click();
    expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'outside'`, async() => {
    await page.selectAutoClose('outside');
    const dropdown = page.getDropdown('#dropdown');

    // escape
    await page.open(dropdown);
    await sendKey(Key.ESCAPE);
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on ESC`);

    // outside click
    await page.open(dropdown);
    await page.clickOutside();
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on outside click`);

    // date selection
    await page.open(dropdown);
    await page.getFirstItem(dropdown).click();
    expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should NOT be closed on date selection`);
  });

  it(`should work when autoClose === 'inside'`, async() => {
    await page.selectAutoClose('inside');
    const dropdown = page.getDropdown('#dropdown');

    // escape
    await page.open(dropdown);
    await sendKey(Key.ESCAPE);
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on ESC`);

    // outside click
    await page.open(dropdown);
    await page.clickOutside();
    expect(await page.isOpened(dropdown)).toBeTruthy(`Dropdown should NOT be closed on outside click`);

    // date selection
    await page.getFirstItem(dropdown).click();
    expect(await page.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed on date selection`);
  });
});
