import { NgbTypeaheadConfig } from './typeahead-config';
import { describe, expect, it } from 'vitest';

describe('ngb-typeahead-config', () => {
	it('should have sensible default values', () => {
		const config = new NgbTypeaheadConfig();

		expect(config.container).toBeUndefined();
		expect(config.editable).toBeTruthy();
		expect(config.focusFirst).toBeTruthy();
		expect(config.selectOnExact).toBeFalsy();
		expect(config.showHint).toBeFalsy();
		expect(config.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
		expect(config.popperOptions({})).toEqual({});
	});
});
