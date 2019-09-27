import {Key} from 'protractor';
import {expectFocused, expectNoOpenModals, openUrl, sendKey} from '../../tools.po';
import {ModalNestingPage} from './modal-nesting.po';
import {DatepickerPage} from '../../datepicker/datepicker.po';
import {DropdownPage} from '../../dropdown/dropdown.po';
import {TypeaheadPage} from '../../typeahead/typeahead.po';

describe('Modal nested components', () => {
  let page: ModalNestingPage;
  let datepickerPage: DatepickerPage;
  let dropdownPage: DropdownPage;
  let typeaheadPage: TypeaheadPage;

  beforeAll(() => {
    page = new ModalNestingPage();
    datepickerPage = new DatepickerPage();
    dropdownPage = new DropdownPage();
    typeaheadPage = new TypeaheadPage();
  });

  beforeEach(async() => await openUrl('modal/nesting'));

  afterEach(async() => { await expectNoOpenModals(); });

  it('should close only datepicker, then modal on ESC', async() => {
    await page.openModal();

    // open datepicker
    await page.getDatepickerButton().click();
    expect(await datepickerPage.getDatepicker().isPresent()).toBeTruthy(`Datepicker should be opened`);
    await expectFocused(await datepickerPage.getDayElement(new Date(2018, 0, 1)), `01 JAN 2018 should be focused`);

    // close datepicker
    await sendKey(Key.ESCAPE);
    expect(await datepickerPage.getDatepicker().isPresent()).toBeFalsy(`Datepicker should be closed`);
    await expectFocused(await page.getDatepickerButton(), `Datepicker open button should be focused`);
    expect(await page.getModal().isPresent()).toBeTruthy(`Modal should stay opened`);

    // close modal
    await sendKey(Key.ESCAPE);
  });

  it('should close only dropdown, then modal on ESC', async() => {
    await page.openModal();

    // open dropdown
    await page.getDropdownButton().click();
    const dropdown = dropdownPage.getDropdown();
    expect(await dropdownPage.isOpened(dropdown)).toBeTruthy(`Dropdown should be opened`);
    await expectFocused(page.getDropdownButton(), `Dropdown button should be focused`);

    // close dropdown
    await sendKey(Key.ESCAPE);
    expect(await dropdownPage.isOpened(dropdown)).toBeFalsy(`Dropdown should be closed`);
    await expectFocused(await page.getDropdownButton(), `Dropdown open button should be focused`);
    expect(await page.getModal().isPresent()).toBeTruthy(`Modal should stay opened`);

    // close modal
    await sendKey(Key.ESCAPE);
  });

  it('should close only typeahead, then modal on ESC', async() => {
    await page.openModal();

    // open typeahead
    await page.getTypeaheadInput().click();
    await sendKey(Key.SPACE);
    expect(await typeaheadPage.getDropdown().isPresent()).toBeTruthy(`Typeahead should be opened`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should be focused`);

    // close dropdown
    await sendKey(Key.ESCAPE);
    expect(await typeaheadPage.getDropdown().isPresent()).toBeFalsy(`Typeahead should be closed`);
    await expectFocused(page.getTypeaheadInput(), `Typeahead input should be focused`);
    expect(await page.getModal().isPresent()).toBeTruthy(`Modal should stay opened`);

    // close modal
    await sendKey(Key.ESCAPE);
  });
});
