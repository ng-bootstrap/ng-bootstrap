import { focusElement, sendKey } from '../../tools.po';
import { waitForModalCount } from '../modal.po';

export const openModal = async (type: string) => {
	await focusElement(`#open-modal-${type}`);
	await sendKey('Enter');
	await waitForModalCount(1);
};
