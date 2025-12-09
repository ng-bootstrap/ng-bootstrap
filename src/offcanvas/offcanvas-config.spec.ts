import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbOffcanvasConfig } from './offcanvas-config';
import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

describe('NgbOffcanvasConfig', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbOffcanvasConfig);
		const ngbConfig = TestBed.inject(NgbConfig);

		expect(config.animation).toBe(ngbConfig.animation);
		expect(config.ariaDescribedBy).toBeUndefined();
		expect(config.ariaLabelledBy).toBeUndefined();
		expect(config.backdrop).toBe(true);
		expect(config.backdropClass).toBeUndefined();
		expect(config.beforeDismiss).toBeUndefined();
		expect(config.container).toBeUndefined();
		expect(config.injector).toBeUndefined();
		expect(config.keyboard).toBe(true);
		expect(config.panelClass).toBeUndefined();
		expect(config.position).toBe('start');
		expect(config.scroll).toBe(false);
	});

	it('should compile when setting config backdrop to static', () => {
		const config = TestBed.inject(NgbOffcanvasConfig);
		config.backdrop = 'static';
	});
});
