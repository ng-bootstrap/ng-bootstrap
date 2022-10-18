import { NgbInputDatepickerConfig } from './datepicker-input-config';

describe('NgbInputDatepickerConfig', () => {
	it('should have sensible default values', () => {
		const config = new NgbInputDatepickerConfig();

		expect(config.autoClose).toBe(true);
		expect(config.container).toBeUndefined();
		expect(config.positionTarget).toBeUndefined();
		expect(config.placement).toEqual(['bottom-start', 'bottom-end', 'top-start', 'top-end']);
		expect(config.popperOptions({})).toEqual({});
		expect(config.restoreFocus).toBe(true);
	});
});
