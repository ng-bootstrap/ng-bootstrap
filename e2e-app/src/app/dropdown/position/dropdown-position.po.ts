import {$} from 'protractor';

export class DropdownPositionPage {
  async removeFromDom() { await $('#isInDom-false').click(); }

  async toggleContainer(container: null | 'body') { await $(`#container-${container || 'null'}`).click(); }

  async togglePlacement(placement: 'top-left' | 'bottom-left' | 'top-right' | 'bottom-right') {
    await $(`#placement-${placement}`).click();
  }
}
