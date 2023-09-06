import { getPage } from '../../../baseTest';

export const SELECTOR_SLIDER = 'ngb-slider';
export const SELECTOR_SLIDER_HANDLE = 'button.ngb-slider-handle';
export const SELECTOR_MIN_LABEL = 'div.ngb-slider-label-min';
export const SELECTOR_MAX_LABEL = 'div.ngb-slider-label-max';
export const SELECTOR_MIN_LABEL_VERTICAL = 'div.ngb-slider-label-vertical-min';
export const SELECTOR_MAX_LABEL_VERTICAL = 'div.ngb-slider-label-vertical-max';
export const SELECTOR_SLIDER_PROGRESS = 'div.ngb-slider-progress';

export const sliderHandleState = async () => {
	return await getPage()
		.locator(SELECTOR_SLIDER_HANDLE)
		.evaluateAll((rootNode: HTMLElement[]) => {
			return rootNode.map((rn) => {
				return {
					style: rn.getAttribute('style'),
					value: rn.getAttribute('aria-valuenow'),
					min: rn.getAttribute('aria-valuemin'),
					max: rn.getAttribute('aria-valuemax'),
					text: rn.getAttribute('aria-valuetext'),
					disabled: rn.getAttribute('aria-disabled'),
					readonly: rn.getAttribute('aria-readonly'),
				};
			});
		});
};

export const sliderProgressState = async () => {
	return await getPage()
		.locator(SELECTOR_SLIDER_PROGRESS)
		.evaluateAll((rootNode: HTMLElement[]) => {
			return rootNode.map((rn) => rn.getAttribute('style'));
		});
};
