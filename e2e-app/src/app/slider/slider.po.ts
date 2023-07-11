import { getPage } from '../../../baseTest';

export const SELECTOR_SLIDER = 'ngb-slider';
export const SELECTOR_SLIDER_HANDLE = 'button.ngb-slider-handle';
export const SELECTOR_MIN_LABEL = 'div.ngb-slider-label-min';
export const SELECTOR_MAX_LABEL = 'div.ngb-slider-label-max';

export const sliderState = async () => {
	return await getPage()
		.locator(SELECTOR_SLIDER)
		.evaluate((rootNode: HTMLElement) => {
			return {
				value: rootNode.getAttribute('aria-valuenow'),
				min: rootNode.getAttribute('aria-valuemin'),
				max: rootNode.getAttribute('aria-valuemax'),
				text: rootNode.getAttribute('aria-valuetext'),
				disabled: rootNode.getAttribute('aria-disabled'),
				readonly: rootNode.getAttribute('aria-readonly'),
			};
		});
};

export const sliderHandleState = async () => {
	return await getPage()
		.locator(SELECTOR_SLIDER_HANDLE)
		.evaluate((rootNode: HTMLElement) => {
			return rootNode.getAttribute('style');
		});
};
