import {$} from 'protractor';

export class DropdownPositionPage {
  async removeFromDom() { await $('#isInDom-false').click(); }

  async toggleContainer(container: null | 'body') { await $(`#container-${container || 'null'}`).click(); }

  async togglePlacement(placement: 'top-start' | 'bottom-start' | 'top-end' | 'bottom-end') {
    await $(`#placement-${placement}`).click();
  }
}
