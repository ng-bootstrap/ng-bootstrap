import {TypeaheadPage} from '../typeahead.po';
import {openUrl} from '../../tools.po';

describe('Typeahead', () => {
  let page: TypeaheadPage;

  const expectUntouched = async() => {
    const typeaheadInput = page.getTypeaheadInput();
    expect(typeaheadInput.getAttribute('class')).toContain('ng-untouched', `The input shouldn't be touched`);
  };

  const expectTouched = async() => {
    const typeaheadInput = page.getTypeaheadInput();
    expect(typeaheadInput.getAttribute('class')).toContain('ng-touched', `The input shouldn't be touched`);
  };

  beforeAll(() => page = new TypeaheadPage());

  beforeEach(async() => await openUrl('typeahead/validation'));

  it(`should stay valid on item click`, async() => {
    await page.getTypeaheadInput().click();
    expectUntouched();

    const itemElement = page.getDropdownItems().get(0);
    await itemElement.click();
    expectUntouched();

    await page.getInputBefore().click();
    expectTouched();

  });
});
