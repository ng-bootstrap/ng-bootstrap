import {browser, by} from 'protractor';
import {openUrl} from '../../tools.po';
import {DropdownPage} from '../dropdown.po';
import {DropdownPositionPage} from './dropdown-position.po';

const roundLocation = function(location) {
  location.x = Math.round(location.x);
  location.y = Math.round(location.y);

  return location;
};


describe('Dropdown Position', () => {
  let dropdownPositionPage: DropdownPositionPage;
  let dropdownPage: DropdownPage;


  const expectSamePositions = async(placement) => {

    // Setup start conditions
    await dropdownPositionPage.toggleContainer(null);
    await dropdownPositionPage.togglePlacement(placement);

    const dropdownMenu = dropdownPage.getDropdownMenu('#dropdownmenu');
    expect(await dropdownPage.getDropdownMenuParent(dropdownMenu).getAttribute('ngbdropdown'))
        .toBe('', 'The dropdown menu should be appended to the widget');

    // Get position in widget
    const widgetLocation = roundLocation(await dropdownMenu.getLocation());

    // Compare position to body
    await dropdownPositionPage.toggleContainer('body');
    expect(await dropdownPage.getDropdownMenuParent(dropdownMenu).element(by.xpath('..')).getTagName())
        .toBe('body', 'The dropdown menu should be appended to the body');

    const bodyLocation = roundLocation(await dropdownMenu.getLocation());
    expect(bodyLocation).toEqual(widgetLocation, `Positions should give the same results when placed on ${placement}`);

    // Reset
    await dropdownPositionPage.toggleContainer(null);

  };

  beforeAll(() => {
    dropdownPositionPage = new DropdownPositionPage();
    dropdownPage = new DropdownPage();
  });

  beforeEach(async() => await openUrl('dropdown/position'));

  it(`should keep the same position when appended to widget or body`, async() => {

    const dropdown = dropdownPage.getDropdown('#dropdown');
    await dropdownPage.open(dropdown);

    await expectSamePositions('bottom-left');
    await expectSamePositions('top-left');
    await expectSamePositions('bottom-right');
    await expectSamePositions('top-right');

  });

  it(`should be removed on destroy`, async() => {
    const dropdown = dropdownPage.getDropdown('#dropdown');
    await dropdownPage.open(dropdown);
    await dropdownPositionPage.removeFromDom();
    expect(await dropdownPage.getDropdownMenu('#dropdownmenu').isPresent())
        .toBeFalsy(`Dropdown shouldn't be in the dom`);
  });

  it(`should have the body container added and removed`, async() => {
    const dropdown = dropdownPage.getDropdown('#dropdown');
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
