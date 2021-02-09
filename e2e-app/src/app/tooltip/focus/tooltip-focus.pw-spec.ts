import {openUrl} from '../../tools.pw-po';
import {test} from '../../../../playwright.conf';
import {expectTooltipToBeClosed, expectTooltipToBeOpen} from '../tooltip';

describe('Tooltip Focus', () => {

  beforeEach(async() => await openUrl('tooltip/focus', 'h3:text("Tooltip focus")'));

  it(`should work when triggers === 'focus'`, async() => {
    // focusin to show
    await test.page.focus('#btn-tooltip');
    await expectTooltipToBeOpen(`Tooltip should be visible when tooltip button gains focus`);

    // focusout to hide
    await test.page.focus('#btn-after');
    await expectTooltipToBeClosed(`Tooltip should not be visible when tooltip button looses focus`);
  });
});
