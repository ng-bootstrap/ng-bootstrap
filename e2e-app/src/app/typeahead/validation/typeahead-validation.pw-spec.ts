import {openUrl} from '../../tools.pw-po';
import {SELECTOR_TYPEAHEAD, SELECTOR_TYPEAHEAD_ITEMS} from '../typeahead';
import {test} from '../../../../playwright.conf';

describe('Typeahead', () => {

  beforeEach(async() => await openUrl('typeahead/validation'));

  it(`should stay valid on item click`, async() => {
    await test.page.click(SELECTOR_TYPEAHEAD);
    expect(await test.page.getAttribute(SELECTOR_TYPEAHEAD, 'class'))
        .toContain('ng-untouched', `The input shouldn't be touched`);

    await test.page.click(`${SELECTOR_TYPEAHEAD_ITEMS}:first-child`);
    expect(await test.page.getAttribute(SELECTOR_TYPEAHEAD, 'class'))
        .toContain('ng-untouched', `The input shouldn't be touched`);

    await test.page.click('#first');
    expect(await test.page.getAttribute(SELECTOR_TYPEAHEAD, 'class'))
        .toContain('ng-touched', `The input shouldn't be touched`);
  });
});
