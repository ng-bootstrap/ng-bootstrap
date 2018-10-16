import {ModalFocustrapPage} from './modal-focustrap.po';
import {openUrl} from '../tools';

describe('Modal', () => {
  let page: ModalFocustrapPage;

  beforeEach(async() => {
    page = new ModalFocustrapPage();
    await openUrl('modal/focustrap');
  });

  it('should be present on the page', async() => {});
});
