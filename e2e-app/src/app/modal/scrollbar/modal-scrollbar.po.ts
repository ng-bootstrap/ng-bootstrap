import {$, $$, browser} from 'protractor';

export class ModalScrollbarPage {
  getModal(index) { return $$('ngb-modal-window').get(index); }

  getModalButton() { return $('#open-modal'); }

  getCloseIcon() { return $('button.close'); }

  async scrollModal() {
    const idSelectorForScrollingModalBody = 'scroll-modal-body';
    const scriptToExecute = 'document.getElementById(\'' + idSelectorForScrollingModalBody + '\').scrollTo(0,100);';
    await browser.executeScript(scriptToExecute);
  }

  async openModal() {
    await this.getModalButton().click();
    const modal = this.getModal(0);
    expect(await modal.isPresent()).toBeTruthy(`A modal should have been opened`);
    return modal;
  }
}
