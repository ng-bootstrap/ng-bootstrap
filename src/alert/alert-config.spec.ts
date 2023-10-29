import { NgbAlertConfig } from './alert-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-alert-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbAlertConfig);

		expect(config.dismissible).toBe(true);
		expect(config.type).toBe('warning');
	});
});
