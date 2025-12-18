import { TestBed, ComponentFixture } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';

import { ChangeDetectionStrategy, Component, ComponentRef, signal } from '@angular/core';

import { NgbProgressbar, NgbProgressbarStacked } from './progressbar';
import { NgbProgressbarConfig } from './progressbar-config';
import { beforeEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

describe('ngb-progressbar', () => {
	describe('business logic', () => {
		let fixture: ComponentFixture<NgbProgressbar>;
		let progressRef: ComponentRef<NgbProgressbar>;
		let progressCmp: NgbProgressbar;

		beforeEach(() => {
			fixture = TestBed.createComponent(NgbProgressbar);
			progressRef = fixture.componentRef;
			progressCmp = fixture.componentRef.instance;
		});

		it('should initialize inputs with default values', () => {
			const defaultConfig = TestBed.inject(NgbProgressbarConfig);
			expect(progressCmp.max).toBe(defaultConfig.max);
			expect(progressCmp.animated).toBe(defaultConfig.animated);
			expect(progressCmp.striped).toBe(defaultConfig.striped);
			expect(progressCmp.textType).toBe(defaultConfig.textType);
			expect(progressCmp.type).toBe(defaultConfig.type);
		});

		it('should calculate the percentage (default max size)', async () => {
			progressRef.setInput('value', 50);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(50);

			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom max size)', async () => {
			progressRef.setInput('max', 150);
			progressRef.setInput('value', 75);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(50);

			progressRef.setInput('value', 30);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(20);
		});

		it('should calculate the percentage (custom max size of null)', async () => {
			progressRef.setInput('max', <any>null);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom max size of undefined)', async () => {
			progressRef.setInput('max', <any>undefined);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom max size of zero)', async () => {
			progressRef.setInput('max', 0);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom negative max size)', async () => {
			progressRef.setInput('max', -10);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom max size of positive infinity)', async () => {
			progressRef.setInput('max', Number.POSITIVE_INFINITY);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should calculate the percentage (custom max size of negative infinity)', async () => {
			progressRef.setInput('max', Number.NEGATIVE_INFINITY);
			progressRef.setInput('value', 25);
			await fixture.whenStable();

			expect(progressCmp.getPercentValue()).toBe(25);
		});

		it('should set the value to 0 for negative numbers', async () => {
			progressRef.setInput('value', -20);
			await fixture.whenStable();

			expect(progressCmp.getValue()).toBe(0);
		});

		it('should set the value to max if it is higher than max (default max size)', async () => {
			progressRef.setInput('value', 120);
			await fixture.whenStable();

			expect(progressCmp.getValue()).toBe(100);
		});

		it('should set the value to max if it is higher than max (custom max size)', async () => {
			progressRef.setInput('max', 150);
			progressRef.setInput('value', 170);
			await fixture.whenStable();

			expect(progressCmp.getValue()).toBe(150);
		});

		it('should update the value if max updates to a smaller value', async () => {
			progressRef.setInput('value', 80);
			progressRef.setInput('max', 70);
			await fixture.whenStable();

			expect(progressCmp.getValue()).toBe(70);
		});

		it('should not update the value if max updates to a larger value', async () => {
			progressRef.setInput('value', 120);
			progressRef.setInput('max', 150);
			await fixture.whenStable();

			expect(progressCmp.getValue()).toBe(120);
		});
	});

	describe('UI logic', () => {
		class ProgressbarTester {
			private readonly fixture: ComponentFixture<TestComponent>;
			readonly componentInstance: TestComponent;
			readonly progress = page.getByCss('.progress');
			readonly progressBar = page.getByCss('.progress-bar');

			constructor(html: string) {
				this.fixture = createGenericTestComponent(html, TestComponent, false);
				this.componentInstance = this.fixture.componentInstance;
			}

			static async create(html: string) {
				const tester = new ProgressbarTester(html);
				await tester.whenStable();
				return tester;
			}

			async whenStable() {
				await this.fixture.whenStable();
			}
			async expectBarWidthToBe(expectedWidth: string) {
				await expect.element(this.progressBar).toHaveStyle({ width: expectedWidth });
			}
			async expectBarHeightToBe(expectedHeight: string) {
				await expect.element(this.progress).toHaveStyle({ height: expectedHeight });
			}
			async expectBarValueToBe(expectedValue: number) {
				await expect.element(this.progress).toHaveAttribute('aria-valuenow', expectedValue.toString());
			}
			async expectAriaLabelToBe(expectedLabel: string) {
				await expect.element(this.progress).toHaveAttribute('aria-label', expectedLabel);
			}
		}

		it('accepts a value and respond to value changes', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()"/>');

			await tester.expectBarWidthToBe('10%');
			await tester.expectBarValueToBe(10);

			tester.componentInstance.value.set(30);
			await tester.whenStable();

			await tester.expectBarWidthToBe('30%');
			await tester.expectBarValueToBe(30);
		});

		it('accepts a max value and respond to max changes', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [max]="max()"/>');

			await tester.expectBarWidthToBe('20%');

			tester.componentInstance.max.set(200);
			await tester.whenStable();

			await tester.expectBarWidthToBe('5%');
		});

		it('accepts a value and max value above default values', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="150" [max]="150"/>');

			await tester.expectBarWidthToBe('100%');
		});

		it('accepts a custom type', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [type]="type()"/>');

			await expect.element(tester.progressBar).toHaveClass('text-bg-warning');

			tester.componentInstance.type.set('info');
			await tester.whenStable();

			await expect.element(tester.progressBar).toHaveClass('text-bg-info');

			tester.componentInstance.type.set('dark');
			await tester.whenStable();

			await expect.element(tester.progressBar).toHaveClass('text-bg-dark');
		});

		it('accepts a custom text type', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [textType]="textType()"/>');

			await expect.element(tester.progressBar).toHaveClass('text-light');

			tester.componentInstance.textType.set('info');
			await tester.whenStable();

			await expect.element(tester.progressBar).toHaveClass('text-info');
		});

		it('accepts a custom type and text type', async () => {
			const tester = await ProgressbarTester.create(
				'<ngb-progressbar [value]="value()" [type]="type()" [textType]="textType()"/>',
			);

			await expect.element(tester.progressBar).toHaveClass('text-light');
			await expect.element(tester.progressBar).toHaveClass('bg-warning');

			tester.componentInstance.type.set('danger');
			tester.componentInstance.textType.set('info');
			await tester.whenStable();

			await expect.element(tester.progressBar).toHaveClass('bg-danger');
			await expect.element(tester.progressBar).not.toHaveClass('text-bg-danger');
			await expect.element(tester.progressBar).toHaveClass('text-info');
		});

		it('accepts animated as normal attr', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [animated]="animated()"/>');

			await expect.element(tester.progressBar).toHaveClass('progress-bar-animated');

			tester.componentInstance.animated.set(false);
			await tester.whenStable();

			await expect.element(tester.progressBar).not.toHaveClass('progress-bar-animated');
		});

		it('accepts striped as normal attr', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [striped]="striped()"/>');

			await expect.element(tester.progressBar).toHaveClass('progress-bar-striped');

			tester.componentInstance.striped.set(false);
			await tester.whenStable();

			await expect.element(tester.progressBar).not.toHaveClass('progress-bar-striped');
		});

		it('should not add "false" CSS class', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="value()" [striped]="striped()"/>');

			await expect.element(tester.progressBar).toHaveClass('progress-bar-striped');
			await expect.element(tester.progressBar).not.toHaveClass('false');
		});

		it('should stay striped when the type changes', async () => {
			const tester = await ProgressbarTester.create(
				'<ngb-progressbar [value]="value()" [type]="type()" [striped]="true"/>',
			);

			await expect.element(tester.progressBar).toHaveClass('text-bg-warning');
			await expect.element(tester.progressBar).toHaveClass('progress-bar-striped');

			tester.componentInstance.type.set('success');
			await tester.whenStable();

			await expect.element(tester.progressBar).toHaveClass('text-bg-success');
			await expect.element(tester.progressBar).toHaveClass('progress-bar-striped');
		});

		it('sets the min and max values as aria attributes', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="130" [max]="150"/>');

			await expect.element(tester.progress).toHaveAttribute('aria-valuemin', '0');
			await expect.element(tester.progress).toHaveAttribute('aria-valuemax', '150');
		});

		it('should display the progress-bar label', async () => {
			const tester = await ProgressbarTester.create(
				'<ngb-progressbar [value]="150" [max]="150">label goes here</ngb-progressbar>',
			);

			await expect.element(tester.progressBar).toHaveTextContent('label goes here');
		});

		it('should display the current percentage value', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [showValue]="true" [value]="150" [max]="150"/>');

			await expect.element(tester.progressBar).toHaveTextContent('100%');
		});

		it('should accepts height values', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar [value]="150" height="10px"/>');

			await tester.expectBarHeightToBe('10px');
		});

		it('should have default accessible name', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar/>');

			await tester.expectAriaLabelToBe('progress bar');
		});

		it('should have custom accessible name', async () => {
			const tester = await ProgressbarTester.create('<ngb-progressbar ariaLabel="flupke"/>');

			await tester.expectAriaLabelToBe('flupke');
		});

		it('should set width on progress when inside <ngb-progressbar-stacked>', async () => {
			const tester = await ProgressbarTester.create(
				'<ngb-progressbar-stacked><ngb-progressbar [value]="50"/></ngb-progressbar-stacked>',
			);

			await expect.element(tester.progressBar).not.toHaveStyle({ width: '50%' });
			await expect.element(tester.progress).toHaveStyle({ width: '50%' });
		});
	});

	describe('Custom config', () => {
		let config: NgbProgressbarConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbProgressbarConfig);
			config.max = 1000;
			config.striped = true;
			config.animated = true;
			config.textType = 'white';
			config.type = 'success';
		});

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(NgbProgressbar);
			fixture.detectChanges();

			let progressbar = fixture.componentInstance;
			expect(progressbar.max).toBe(config.max);
			expect(progressbar.striped).toBe(config.striped);
			expect(progressbar.animated).toBe(config.animated);
			expect(progressbar.textType).toBe(config.textType);
			expect(progressbar.type).toBe(config.type);
		});
	});

	describe('Custom config as provider', () => {
		let config: NgbProgressbarConfig;

		beforeEach(() => {
			config = TestBed.inject(NgbProgressbarConfig);
			config.max = 1000;
			config.striped = true;
			config.animated = true;
			config.textType = 'light';
			config.type = 'success';
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = TestBed.createComponent(NgbProgressbar);
			fixture.detectChanges();

			let progressbar = fixture.componentInstance;
			expect(progressbar.max).toBe(config.max);
			expect(progressbar.striped).toBe(config.striped);
			expect(progressbar.animated).toBe(config.animated);
			expect(progressbar.textType).toBe(config.textType);
			expect(progressbar.type).toBe(config.type);
		});
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbProgressbar, NgbProgressbarStacked],
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	value = signal(10);
	max = signal(50);
	animated = signal(true);
	striped = signal(true);

	textType = signal('light');
	type = signal('warning');
}
