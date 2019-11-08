import {by} from 'protractor';
import {openUrl} from '../../tools.po';
import {DropdownPage} from '../dropdown.po';
import {DropdownPositionPage} from './dropdown-position.po';

const compareLocation = function(location1, location2, msg) {
  expect(Math.abs(location1.x - location2.x)).toBeLessThan(1, msg + '(x)');
  expect(Math.abs(location1.y - location2.y)).toBeLessThan(1, msg + '(y)');
  if (location1.width) {
    expect(Math.abs(location1.width - location2.width)).toBeLessThan(1, msg + '(width)');
    expect(Math.abs(location1.height - location2.height)).toBeLessThan(1, msg + '(height)');
  }

};

['#dropdown', '#dropdownWithTemplate'].forEach((selector) => {
  describe(`Dropdown Position for id ${selector}`, () => {
    let dropdownPositionPage: DropdownPositionPage;
    let dropdownPage: DropdownPage;


    const expectSamePositions = async(placement) => {

      // Setup start conditions
      await dropdownPositionPage.toggleContainer(null);
      await dropdownPositionPage.togglePlacement(placement);

      const dropdownMenu = dropdownPage.getDropdownMenu(`${selector}Menu`);
      expect(await dropdownPage.getDropdownMenuParent(dropdownMenu).getAttribute('ngbdropdown'))
          .toBe('', 'The dropdown menu should be appended to the widget');

      // Get position in widget
      const widgetLocation = await dropdownMenu.getLocation();

      // Compare position to body
      await dropdownPositionPage.toggleContainer('body');
      expect(await dropdownPage.getDropdownMenuParent(dropdownMenu).element(by.xpath('..')).getTagName())
          .toBe('body', 'The dropdown menu should be appended to the body');

      const bodyLocation = await dropdownMenu.getLocation();

      compareLocation(
          bodyLocation, widgetLocation, `Positions should give the same results when placed on ${placement}`);
      // expect(bodyLocation)
      //     .toEqual(widgetLocation, `Positions should give the same results when placed on ${placement}`);

      // Reset
      await dropdownPositionPage.toggleContainer(null);

    };

    beforeAll(() => {
      dropdownPositionPage = new DropdownPositionPage();
      dropdownPage = new DropdownPage();
    });

    beforeEach(async() => await openUrl('dropdown/position'));

    it(`should keep the same position when appended to widget or body`, async() => {

      const dropdown = dropdownPage.getDropdown(selector);
      await dropdownPage.open(dropdown);

      await expectSamePositions('bottom-left');
      await expectSamePositions('top-left');
      await expectSamePositions('bottom-right');
      await expectSamePositions('top-right');

    });

    it(`should be removed on destroy`, async() => {
      const dropdown = dropdownPage.getDropdown(selector);
      await dropdownPage.open(dropdown);
      await dropdownPositionPage.removeFromDom();
      expect(await dropdownPage.getDropdownMenu(`${selector}Menu`).isPresent())
          .toBeFalsy(`Dropdown shouldn't be in the dom`);
    });

    it(`should have the body container added and removed`, async() => {
      const dropdown = dropdownPage.getDropdown(selector);
      await dropdownPositionPage.toggleContainer('body');
      await dropdownPage.open(dropdown);

      await dropdownPositionPage.togglePlacement('bottom-left');
      expect(await dropdownPage.getBodyContainers().count())
          .toBe(1, `Dropdown menu container should be found on the body`);

      await dropdownPositionPage.togglePlacement('top-left');
      expect(await dropdownPage.getBodyContainers().count())
          .toBe(1, `Dropdown menu container should be found on the body`);

      await dropdownPositionPage.toggleContainer(null);
      expect(await dropdownPage.getBodyContainers().count())
          .toBe(0, `Dropdown menu container shouldn't be found on the body`);

    });

  });
});
