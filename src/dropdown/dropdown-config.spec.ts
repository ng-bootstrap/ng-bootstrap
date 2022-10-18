import { NgbDropdownConfig } from './dropdown-config';

describe('ngb-dropdown-config', () => {
	it('should have sensible default values', () => {
		const config = new NgbDropdownConfig();

		expect(config.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
		expect(config.popperOptions({})).toEqual({});
		expect(config.autoClose).toBe(true);
	});

	it('should allow setting "inside" and "outside" value for autoClose', () => {
		const config = new NgbDropdownConfig();

		// This test looks like having trivial assertions but its goal
		// is to prove that we've got TS typings right.
		config.autoClose = 'outside';
		expect(config.autoClose).toBe('outside');
		config.autoClose = 'inside';
		expect(config.autoClose).toBe('inside');
	});
});
