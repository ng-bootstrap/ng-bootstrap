import {getPage, getBrowserName} from '../../../baseTest';
import {timeoutMessage} from '../tools.po';
export const SELECTOR_MODAL_DIALOG = '.modal-dialog';
export const SELECTOR_MODAL_WINDOW = 'ngb-modal-window';

const defaultErrorMessage = (modalNumber) => {
  return modalNumber ? `Number of expected modals : ${modalNumber}` : `There should be no open modal windows`;
};

/**
 *
 * @param modalNumber Expected modal number
 * @param errorMessage
 */
export const waitForModalCount = async(modalNumber, errorMessage = defaultErrorMessage(modalNumber)) => {
  // These successive waiting functions, done in this order, render the test suite more stable.
  await timeoutMessage(
      getPage().waitForFunction(
          modalNumber ? `document.body.className.indexOf('modal-open') > -1` :
                        `document.body.className.indexOf('modal-open') === -1`),
      errorMessage);
  await timeoutMessage(
      getPage().waitForFunction(`document.querySelectorAll('${SELECTOR_MODAL_WINDOW}').length === ${modalNumber}`),
      errorMessage);
  await timeoutMessage(
      getPage().waitForFunction(`document.querySelectorAll('${SELECTOR_MODAL_DIALOG}').length === ${modalNumber}`),
      errorMessage);

  if (getBrowserName() === 'webkit') {
    // Need some extra time for webkit, otherwise the modal tests are not stable.
    await getPage().waitForTimeout(50);
  }
};

/**
 * Wait a short time before checking that nothing changed
 */
export const waitForNoChange = async() => {
  await getPage().waitForTimeout(25);
};
