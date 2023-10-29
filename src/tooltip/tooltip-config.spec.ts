import { NgbTooltipConfig } from './tooltip-config';

import { NgbConfig } from '../ngb-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-tooltip-config', () => {
	it('should have sensible default values', () => {
		const ngbConfig = TestBed.inject(NgbConfig);
		const config = TestBed.inject(NgbTooltipConfig);

		expect(config.animation).toBe(ngbConfig.animation);
		expect(config.autoClose).toBe(true);
		expect(config.placement).toBe('auto');
		expect(config.popperOptions({})).toEqual({});
		expect(config.triggers).toBe('hover focus');
		expect(config.container).toBeUndefined();
		expect(config.disableTooltip).toBe(false);
		expect(config.tooltipClass).toBeUndefined();
		expect(config.openDelay).toBe(0);
		expect(config.closeDelay).toBe(0);
	});
});
