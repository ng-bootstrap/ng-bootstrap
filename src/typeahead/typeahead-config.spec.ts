import { NgbTypeaheadConfig } from './typeahead-config';

describe('ngb-typeahead-config', () => {
	it('should have sensible default values', () => {
		const config = new NgbTypeaheadConfig();

		expect(config.container).toBeUndefined();
		expect(config.editable).toBeTruthy();
		expect(config.focusFirst).toBeTruthy();
		expect(config.showHint).toBeFalsy();
		expect(config.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
		expect(config.popperOptions({})).toEqual({});
	});
});
