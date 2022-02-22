import {test, getPage, setPage} from '../../../../baseTest';
import {sendKey, waitForFocus} from '../../tools.po';
import {waitForModalCount} from '../modal.po';

import {
  openModal,
  openStackModal,
  SELECTOR_STACK_MODAL,
  SELECTOR_STACK_MODAL_BUTTON,
  SELECTOR_CLOSE_ICON
} from './modal-stack.po';

test.use({testURL: 'modal/stack', testSelector: 'h3:text("Modal stack tests")'});
test.beforeEach(async({page}) => setPage(page));

test.describe('Modal stack', () => {

  test.afterEach(async() => { await waitForModalCount(0); });

  test('should keep tab on the first modal after the second modal has closed', async() => {
    await openModal();
    await openStackModal();
    await waitForModalCount(2);

    // close the stack modal
    await sendKey('Escape');
    await getPage().waitForSelector(SELECTOR_STACK_MODAL, {state: 'detached'});
    await waitForModalCount(1);

    // Check that the button is focused again
    await waitForFocus(SELECTOR_STACK_MODAL_BUTTON, 'Button element not focused');
    await sendKey('Tab');

    await waitForFocus(SELECTOR_CLOSE_ICON, 'Close icon not focused');

    // close the main modal
    await sendKey('Escape');
  });

});
