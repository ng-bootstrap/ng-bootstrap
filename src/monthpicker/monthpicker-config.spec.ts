import { NgbMonthpickerConfig } from './monthpicker-config';

describe('ngb-monthpicker-config', () => {
	it('should have sensible default values', () => {
		const config = new NgbMonthpickerConfig();

		expect(config.monthTemplate).toBeUndefined();
		expect(config.displayYears).toBe(1);
		expect(config.markDisabled).toBeUndefined();
		expect(config.minDate).toBeUndefined();
		expect(config.maxDate).toBeUndefined();
		expect(config.navigation).toBe('select');
		expect(config.startDate).toBeUndefined();
	});
});
