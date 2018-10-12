import {browser, by, element, ElementFinder} from 'protractor';

export class ModalFocustrapPage {
  navigateTo() { return browser.get('#/modal/focustrap'); }

  getModal(selector = 'ngb-modal-window') { return element(by.css(selector)); }

  getText(modal: ElementFinder) { return modal.element(by.css('div.modal-content')).getText(); }
}
