import { NgbPopoverConfig } from './popover-config';
import { NgbConfig } from '../ngb-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-popover-config', () => {
	it('should have sensible default values', () => {
		const ngbConfig = TestBed.inject(NgbConfig);
		const config = TestBed.inject(NgbPopoverConfig);

		expect(config.animation).toBe(ngbConfig.animation);
		expect(config.autoClose).toBe(true);
		expect(config.placement).toBe('auto');
		expect(config.popperOptions({})).toEqual({});
		expect(config.triggers).toBe('click');
		expect(config.container).toBeUndefined();
		expect(config.disablePopover).toBe(false);
		expect(config.popoverClass).toBeUndefined();
		expect(config.openDelay).toBe(0);
		expect(config.closeDelay).toBe(0);
	});
});
