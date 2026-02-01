import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericAsyncTestComponent } from '../test/common';

import { Component, DebugElement, Injectable, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgbTimepickerConfig } from './timepicker-config';
import { NgbTimepicker } from './timepicker';
import { NgbTimepickerI18n } from './timepicker-i18n';
import { NgbTimeAdapter, NgbTimeStructAdapter } from './ngb-time-adapter';
import { NgbTimeStruct } from './ngb-time-struct';
import { beforeEach, describe, expect, it } from 'vitest';

const createTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponent);

const createOnPushTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponentOnPush);

function getTimepicker(el: HTMLElement) {
	return el.querySelector('ngb-timepicker');
}

function getInputs(el: HTMLElement) {
	return el.querySelectorAll('input');
}

function getButtons(nativeEl: HTMLElement) {
	return nativeEl.querySelectorAll('button.btn-link');
}

function getFieldsetElement(element: HTMLElement): HTMLFieldSetElement {
	return <HTMLFieldSetElement>element.querySelector('fieldset');
}

function getMeridianButton(nativeEl: HTMLElement) {
	return nativeEl.querySelector('button.btn-outline-primary')!;
}

function createChangeEvent(value: string) {
	return { target: { value: value } };
}

function expectToDisplayTime(el: HTMLElement, time: string) {
	const inputs = getInputs(el);
	const timeParts = time.split(':');
	let timeInInputs: string[] = [];

	expect(inputs.length).toBe(timeParts.length);

	for (let i = 0; i < inputs.length; i++) {
		timeInInputs.push((<HTMLInputElement>inputs[i]).value);
	}

	expect(timeInInputs.join(':')).toBe(time);
}

function expectSameValues(timepicker: NgbTimepicker, config: NgbTimepickerConfig) {
	expect(timepicker.meridian).toBe(config.meridian);
	expect(timepicker.spinners).toBe(config.spinners);
	expect(timepicker.seconds).toBe(config.seconds);
	expect(timepicker.hourStep).toBe(config.hourStep);
	expect(timepicker.minuteStep).toBe(config.minuteStep);
	expect(timepicker.secondStep).toBe(config.secondStep);
	expect(timepicker.disabled).toBe(config.disabled);
	expect(timepicker.readonlyInputs).toBe(config.readonlyInputs);
	expect(timepicker.size).toBe(config.size);
}

function customizeConfig(config: NgbTimepickerConfig) {
	config.meridian = true;
	config.spinners = false;
	config.seconds = true;
	config.hourStep = 2;
	config.minuteStep = 3;
	config.secondStep = 4;
	config.disabled = true;
	config.readonlyInputs = true;
}

describe('ngb-timepicker', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	describe('initialization', () => {
		it('should initialize inputs with provided config', () => {
			const defaultConfig = new NgbTimepickerConfig();
			const timepicker = new NgbTimepicker(
				new NgbTimepickerConfig(),
				new NgbTimeStructAdapter(),
				<any>null,
				new TestI18n(),
			);
			expectSameValues(timepicker, defaultConfig);
		});
	});

	describe('rendering based on model', () => {
		it('should render hour and minute inputs', async () => {
			const html = `<ngb-timepicker [ngModel]="model()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30');
		});

		it('should update inputs value on model change', async () => {
			const html = `<ngb-timepicker [ngModel]="model()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30');

			fixture.componentInstance.model.set({ hour: 14, minute: 40 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '14:40');
		});

		it('should render hour and minute inputs with padding', async () => {
			const html = `<ngb-timepicker [ngModel]="model()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 1, minute: 3 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '01:03');
		});

		it('should render hour, minute and seconds inputs with padding', async () => {
			const html = `<ngb-timepicker [ngModel]="model()" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 3, second: 4 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:03:04');
		});

		it('should render invalid or empty hour and minute as blank string', async () => {
			const html = `<ngb-timepicker [ngModel]="model()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: undefined, minute: 'aaa' });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, ':');
		});

		it('should render invalid or empty second as blank string', async () => {
			const html = `<ngb-timepicker [ngModel]="model()" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 20, second: false });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:20:');
		});

		it('should render empty fields on null model', async () => {
			const html = `<ngb-timepicker [ngModel]="model()" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set(null);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '::');
		});
	});

	describe('model updates in response to increment / decrement button clicks', () => {
		it('should increment / decrement hours', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 11, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should wrap hours', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 23, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '23:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 23, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '00:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 0, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '23:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 23, minute: 30, second: 0 });
		});

		it('should increment / decrement minutes', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:31');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 31, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should wrap minutes', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 22, minute: 59, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '22:59');
			expect(fixture.componentInstance.model()).toEqual({ hour: 22, minute: 59, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expect(fixture.componentInstance.model()).toEqual({ hour: 23, minute: 0, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '22:59');
			expect(fixture.componentInstance.model()).toEqual({ hour: 22, minute: 59, second: 0 });
		});

		it('should increment / decrement seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:01');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 1 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should wrap seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 59 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:59');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 59 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:31:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 31, second: 0 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:59');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 59 });
		});
	});

	describe('increment/decrement keyboard bindings', () => {
		function getDebugInputs(fixture: ComponentFixture<TestComponent>): Array<DebugElement> {
			return fixture.debugElement.queryAll(By.css('input'));
		}

		it('should increment / decrement hours', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			const hourInput = getDebugInputs(fixture)[0];

			hourInput.triggerEventHandler('keydown.ArrowUp', { preventDefault: () => {} }); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 11, minute: 30, second: 0 });

			hourInput.triggerEventHandler('keydown.ArrowDown', { preventDefault: () => {} }); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement minutes', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			const minuteInput = getDebugInputs(fixture)[1];

			minuteInput.triggerEventHandler('keydown.ArrowUp', { preventDefault: () => {} }); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:31');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 31, second: 0 });

			minuteInput.triggerEventHandler('keydown.ArrowDown', { preventDefault: () => {} }); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			const secondInput = getDebugInputs(fixture)[2];

			secondInput.triggerEventHandler('keydown.ArrowUp', { preventDefault: () => {} }); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:01');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 1 });

			secondInput.triggerEventHandler('keydown.ArrowDown', { preventDefault: () => {} }); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});
	});

	describe('model updates in response to input field changes', () => {
		it('should update hours', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			inputs[0].triggerEventHandler('change', createChangeEvent('11'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 11, minute: 30, second: 0 });

			inputs[0].triggerEventHandler('change', createChangeEvent(`${24 + 11}`));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 11, minute: 30, second: 0 });

			inputs[0].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, ':30');
			expect(fixture.componentInstance.model()).toEqual(null);
		});

		it('should update minutes', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			inputs[1].triggerEventHandler('change', createChangeEvent('40'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:40');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 40, second: 0 });

			inputs[1].triggerEventHandler('change', createChangeEvent('70'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:10');
			expect(fixture.componentInstance.model()).toEqual({ hour: 11, minute: 10, second: 0 });

			inputs[1].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:');
			expect(fixture.componentInstance.model()).toEqual(null);
		});

		it('should update seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			inputs[2].triggerEventHandler('change', createChangeEvent('40'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:40');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 40 });

			inputs[2].triggerEventHandler('change', createChangeEvent('70'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:31:10');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 31, second: 10 });

			inputs[2].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:31:');
			expect(fixture.componentInstance.model()).toEqual(null);
		});
	});

	describe('meridian', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbTimepickerI18n, useClass: TestI18n }],
			});
		});

		it('should render meridian button with proper value', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30, second: 0 });
			const meridianButton = getMeridianButton(fixture.nativeElement);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '01:30:00');
			expect(meridianButton.textContent).toBe('afternoon');

			fixture.componentInstance.model.set({ hour: 1, minute: 30, second: 0 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '01:30:00');
			expect(meridianButton.textContent).toBe('morning');
		});

		it('should render 12 PM/AM as 12:mm and meridian button with proper value', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 12, minute: 30, second: 0 });
			const meridianButton = getMeridianButton(fixture.nativeElement);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '12:30:00');
			expect(meridianButton.textContent).toBe('afternoon');

			fixture.componentInstance.model.set({ hour: 0, minute: 30, second: 0 });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '12:30:00');
			expect(meridianButton.textContent).toBe('morning');
		});

		it('should update model on meridian click', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30, second: 0 });
			const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '01:30:00');
			expect(meridianButton.textContent).toBe('afternoon');

			meridianButton.click();
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '01:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 1, minute: 30, second: 0 });
			expect(meridianButton.textContent).toBe('morning');
		});

		it('should respect meridian when propagating model (PM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 14, minute: 30 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('3'));
			expect(fixture.componentInstance.model()).toEqual({ hour: 15, minute: 30, second: 0 });
		});

		it('should respect meridian when propagating model (AM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 9, minute: 30 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('10'));
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should interpret 12 as midnight (00:00) when meridian is set to AM', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 9, minute: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('12'));
			expect(fixture.componentInstance.model()).toEqual({ hour: 0, minute: 0, second: 0 });
		});

		it('should interpret 12 as noon (12:00) when meridian is set to PM', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 18, minute: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('12'));
			expect(fixture.componentInstance.model()).toEqual({ hour: 12, minute: 0, second: 0 });
		});

		it('should interpret hour more than 12 as 24h value (AM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 7, minute: 30, second: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

			inputs[0].triggerEventHandler('change', createChangeEvent('22'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(meridianButton.textContent).toBe('afternoon');
			expect(fixture.componentInstance.model()).toEqual({ hour: 22, minute: 30, second: 0 });
		});

		it('should interpret hour more than 12 as 24h value (PM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 15, minute: 30, second: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

			inputs[0].triggerEventHandler('change', createChangeEvent('22'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(meridianButton.textContent).toBe('afternoon');
			expect(fixture.componentInstance.model()).toEqual({ hour: 22, minute: 30, second: 0 });
		});

		it('should use remainder of division by 24 as a value in 24h format when hour > 24 (AM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 7, minute: 30, second: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

			inputs[0].triggerEventHandler('change', createChangeEvent(`${24 + 9}`));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '09:30');
			expect(meridianButton.textContent).toBe('morning');
			expect(fixture.componentInstance.model()).toEqual({ hour: 9, minute: 30, second: 0 });
		});

		it('should use remainder of division by 24 as a value in 24h format when hour > 24 (PM)', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [meridian]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 15, minute: 30, second: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			const meridianButton = <HTMLButtonElement>getMeridianButton(fixture.nativeElement);

			inputs[0].triggerEventHandler('change', createChangeEvent(`${24 + 9}`));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '09:30');
			expect(meridianButton.textContent).toBe('morning');
			expect(fixture.componentInstance.model()).toEqual({ hour: 9, minute: 30, second: 0 });
		});
	});

	describe('forms', () => {
		it('should work with template-driven form validation - valid status', async () => {
			const html = `
          <form>
            <ngb-timepicker [(ngModel)]="model" name="control" required></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-invalid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-valid');

			fixture.componentInstance.model.set({ hour: 12, minute: 0, second: 0 });
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should work with template-driven form validation - visited status - hours', async () => {
			const html = `
         <form>
           <ngb-timepicker [(ngModel)]="model" name="control" required></ngb-timepicker>
         </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const hourInput = fixture.debugElement.query(By.css('.ngb-tp-hour input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			hourInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			hourInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with template-driven form validation - visited status - minutes', async () => {
			const html = `
        <form>
          <ngb-timepicker [(ngModel)]="model" name="control" required></ngb-timepicker>
        </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const minuteInput = fixture.debugElement.query(By.css('.ngb-tp-minute input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			minuteInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			minuteInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with template-driven form validation - visited status - seconds', async () => {
			const html = `
           <form>
             <ngb-timepicker [(ngModel)]="model" name="control" seconds="true" required></ngb-timepicker>
           </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const secondInput = fixture.debugElement.query(By.css('.ngb-tp-second input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			secondInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			secondInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with template-driven form validation when meridian is true - valid status', async () => {
			const html = `
          <form>
            <ngb-timepicker [(ngModel)]="model" name="control"></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');

			fixture.componentInstance.model.set({ hour: 11, minute: 0, second: 0 });
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should work with template-driven form validation when meridian is true - visited status - hours', async () => {
			const html = `
       <form>
         <ngb-timepicker [(ngModel)]="model" name="control"></ngb-timepicker>
       </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const hourInput = fixture.debugElement.query(By.css('.ngb-tp-hour input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			hourInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			hourInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with template-driven form validation when meridian is true - visited status - minutes', async () => {
			const html = `
       <form>
         <ngb-timepicker [(ngModel)]="model" name="control"></ngb-timepicker>
       </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const minuteInput = fixture.debugElement.query(By.css('.ngb-tp-minute input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			minuteInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			minuteInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with template-driven form validation when meridian is true - visited status - seconds', async () => {
			const html = `
          <form>
            <ngb-timepicker [(ngModel)]="model" name="control" seconds="true"></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const secondInput = fixture.debugElement.query(By.css('.ngb-tp-second input'));

			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			secondInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			secondInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with model-driven form validation - valid status', async () => {
			const html = `
          <form [formGroup]="form">
            <ngb-timepicker formControlName="control" required></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			expect(getTimepicker(compiled)).toHaveCssClass('ng-invalid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-valid');

			inputs[0].triggerEventHandler('change', createChangeEvent('12'));
			inputs[1].triggerEventHandler('change', createChangeEvent('15'));
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-valid');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should work with model-driven form validation - visited status - hours', async () => {
			const html = `
          <form [formGroup]="form">
            <ngb-timepicker formControlName="control" required></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			const hourInput = fixture.debugElement.query(By.css('.ngb-tp-hour input'));

			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			hourInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			hourInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with model-driven form validation - visited status - minutes', async () => {
			const html = `
          <form [formGroup]="form">
            <ngb-timepicker formControlName="control" required></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			const minuteInput = fixture.debugElement.query(By.css('.ngb-tp-minute input'));

			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			minuteInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			minuteInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should work with model-driven form validation - visited status - seconds', async () => {
			const html = `
          <form [formGroup]="form">
            <ngb-timepicker formControlName="control" seconds="true" required></ngb-timepicker>
          </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();
			const secondInput = fixture.debugElement.query(By.css('.ngb-tp-second input'));

			expect(getTimepicker(compiled)).toHaveCssClass('ng-untouched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-touched');

			secondInput.triggerEventHandler('focus', {});
			await fixture.whenStable();
			secondInput.triggerEventHandler('blur', {});
			await fixture.whenStable();
			expect(getTimepicker(compiled)).toHaveCssClass('ng-touched');
			expect(getTimepicker(compiled)).not.toHaveCssClass('ng-untouched');
		});

		it('should propagate model changes only if valid - no seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 12, minute: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();

			expect(fixture.componentInstance.model()).toBeNull();
		});

		it('should propagate model changes only if valid - with seconds', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 12, minute: 0, second: 0 });
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[2].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();

			expect(fixture.componentInstance.model()).toBeNull();
		});

		it('should not submit form when spinners clicked', async () => {
			const html = `<form (ngSubmit)="onSubmit()">
           <ngb-timepicker name="control" [(ngModel)]="model"></ngb-timepicker>
           </form>`;

			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;
			const buttons = getButtons(compiled);
			const button = buttons[0] as HTMLButtonElement;

			await fixture.whenStable();

			button.click();
			await fixture.whenStable();
			expect(fixture.componentInstance.submitted()).toBeFalsy();
		});
	});

	describe('disabled', () => {
		it('should not change the value on button click, when it is disabled', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [disabled]="disabled()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });
		});

		it('should have disabled class, when it is disabled', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [disabled]="disabled()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			await await fixture.whenStable();
			let fieldset = getFieldsetElement(fixture.nativeElement);
			expect(fieldset.hasAttribute('disabled')).toBeTruthy();

			fixture.componentInstance.disabled.set(false);
			await fixture.whenStable();
			fieldset = getFieldsetElement(fixture.nativeElement);
			expect(fieldset.hasAttribute('disabled')).toBeFalsy();
		});

		it('should have disabled attribute when it is disabled using reactive forms', async () => {
			const html = `<form [formGroup]="disabledForm"><ngb-timepicker formControlName="control"></ngb-timepicker></form>`;

			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			let fieldset = getFieldsetElement(fixture.nativeElement);
			expect(fieldset.hasAttribute('disabled')).toBeTruthy();
		});
	});

	describe('readonly', () => {
		it('should change the value on button click, when it is readonly', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [readonlyInputs]="readonly()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 13, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '14:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 14, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:31:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 31, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:01');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 1 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 13, minute: 30, second: 0 });
		});

		it('should not change value on input change, when it is readonly', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [readonlyInputs]="readonly()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			await fixture.whenStable();

			let inputs = getInputs(fixture.nativeElement);
			expect(inputs[0].hasAttribute('readonly')).toBeTruthy();
			expect(inputs[1].hasAttribute('readonly')).toBeTruthy();
			expect(inputs[2].hasAttribute('readonly')).toBeTruthy();

			fixture.componentInstance.readonly.set(false);
			await fixture.whenStable();
			inputs = getInputs(fixture.nativeElement);
			expect(inputs[0].hasAttribute('readonly')).toBeFalsy();
			expect(inputs[1].hasAttribute('readonly')).toBeFalsy();
			expect(inputs[2].hasAttribute('readonly')).toBeFalsy();
		});
	});

	describe('spinners', () => {
		it('should not have spinners if configured so', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true" [spinners]="false"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			const buttons = getButtons(fixture.nativeElement);
			expect(buttons.length).toBe(0);
		});
	});

	describe('size', () => {
		it('should add appropriate CSS classes to buttons and inputs when size is small', async () => {
			const html = `<ngb-timepicker size="small"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			const buttons = getButtons(fixture.nativeElement);
			const inputs = getInputs(fixture.nativeElement);
			for (let i = 0; i < buttons.length; i++) {
				expect(buttons[i]).toHaveCssClass('btn-sm');
			}
			for (let i = 0; i < inputs.length; i++) {
				expect(inputs[i]).toHaveCssClass('form-control-sm');
			}
		});

		it('should add appropriate CSS classes to buttons and inputs when size is large', async () => {
			const html = `<ngb-timepicker size="large"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			const buttons = getButtons(fixture.nativeElement);
			const inputs = getInputs(fixture.nativeElement);
			for (let i = 0; i < buttons.length; i++) {
				expect(buttons[i]).toHaveCssClass('btn-lg');
			}
			for (let i = 0; i < inputs.length; i++) {
				expect(inputs[i]).toHaveCssClass('form-control-lg');
			}
		});

		it('should not add special CSS classes to buttons and inputs when size is medium', async () => {
			const html = `<ngb-timepicker size="medium"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			const buttons = getButtons(fixture.nativeElement);
			const inputs = getInputs(fixture.nativeElement);
			for (let i = 0; i < buttons.length; i++) {
				expect(buttons[i]).not.toHaveCssClass('btn-lg');
			}
			for (let i = 0; i < inputs.length; i++) {
				expect(inputs[i]).not.toHaveCssClass('form-control-lg');
			}
		});

		it('should not add special CSS classes to buttons and inputs when no size is specified', async () => {
			const html = `<ngb-timepicker></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			const buttons = getButtons(fixture.nativeElement);
			const inputs = getInputs(fixture.nativeElement);
			for (let i = 0; i < buttons.length; i++) {
				expect(buttons[i]).not.toHaveCssClass('btn-lg');
			}
			for (let i = 0; i < inputs.length; i++) {
				expect(inputs[i]).not.toHaveCssClass('form-control-lg');
			}
		});
	});

	describe('Custom config', () => {
		let config: NgbTimepickerConfig;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [NgbTimepickerConfig],
			});
			TestBed.overrideComponent(NgbTimepicker, { set: { template: '' } });
			config = TestBed.inject(NgbTimepickerConfig);
			customizeConfig(config);
		});

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(NgbTimepicker);

			const timepicker = fixture.componentInstance;
			expectSameValues(timepicker, config);
		});
	});

	describe('Custom config as provider', () => {
		const config = new NgbTimepickerConfig();
		customizeConfig(config);

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbTimepickerConfig, useValue: config }],
			});
		});

		it('should initialize inputs with provided config as provider', async () => {
			const fixture = await createGenericAsyncTestComponent('', NgbTimepicker);

			const timepicker = fixture.componentInstance;
			expectSameValues(timepicker, config);
		});
	});

	describe('accessibility', () => {
		it('should have text for screen readers on buttons', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expect((<HTMLButtonElement>buttons[0]).querySelector('.visually-hidden')!.textContent).toBe('Increment hours');
			expect((<HTMLButtonElement>buttons[1]).querySelector('.visually-hidden')!.textContent).toBe('Decrement hours');
			expect((<HTMLButtonElement>buttons[2]).querySelector('.visually-hidden')!.textContent).toBe('Increment minutes');
			expect((<HTMLButtonElement>buttons[3]).querySelector('.visually-hidden')!.textContent).toBe('Decrement minutes');
			expect((<HTMLButtonElement>buttons[4]).querySelector('.visually-hidden')!.textContent).toBe('Increment seconds');
			expect((<HTMLButtonElement>buttons[5]).querySelector('.visually-hidden')!.textContent).toBe('Decrement seconds');
		});

		it('should have aria-label for inputs', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="true"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const inputs = getInputs(fixture.nativeElement);

			expect(inputs[0].getAttribute('aria-label')).toBe('Hours');
			expect(inputs[1].getAttribute('aria-label')).toBe('Minutes');
			expect(inputs[2].getAttribute('aria-label')).toBe('Seconds');
		});
	});

	describe('Custom steps', () => {
		const config = new NgbTimepickerConfig();
		config.seconds = true;
		config.hourStep = 2;
		config.minuteStep = 3;
		config.secondStep = 4;

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbTimepickerConfig, useValue: config }],
			});
		});

		it('should increment / decrement hours by 6', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [hourStep]="6"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();
			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '16:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 16, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement hours to default value if step set to undefined', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [hourStep]="undefined"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();

			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[0]).click(); // H+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '12:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 12, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[1]).click(); // H-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement minutes by 7', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [minuteStep]="7"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();

			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:37:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 37, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement minutes to default value if step set to undefined', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [minuteStep]="undefined"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();

			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[2]).click(); // M+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:33:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 33, second: 0 });

			(<HTMLButtonElement>buttons[3]).click(); // M-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement seconds by 8', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [secondStep]="8"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();

			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:08');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 8 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});

		it('should increment / decrement seconds to default value if step set to undefined', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [secondStep]="undefined"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 0 });
			await fixture.whenStable();

			const buttons = getButtons(fixture.nativeElement);

			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });

			(<HTMLButtonElement>buttons[4]).click(); // S+
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:04');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 4 });

			(<HTMLButtonElement>buttons[5]).click(); // S-
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:00');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});
	});

	describe('Seconds handling', () => {
		it('should propagate seconds to 0 in model if seconds not shown and no second in initial model', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="false"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30 });
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			inputs[1].triggerEventHandler('change', createChangeEvent('40'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:40');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 40, second: 0 });
		});

		it('should propagate second as 0 in model if seconds not shown and null initial model', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="false"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			inputs[0].triggerEventHandler('change', createChangeEvent('10'));
			inputs[1].triggerEventHandler('change', createChangeEvent('40'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:40');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 40, second: 0 });
		});

		it('should leave second as is in model if seconds not shown and second present in initial model', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="false"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: 30 });
			await fixture.whenStable();
			const inputs = fixture.debugElement.queryAll(By.css('input'));

			inputs[1].triggerEventHandler('change', createChangeEvent('40'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:40');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 40, second: 30 });
		});

		it('should reset the second to 0 if invalid when seconds are hidden', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model" [seconds]="showSeconds()"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 10, minute: 30, second: null });
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30:');

			fixture.componentInstance.showSeconds.set(false);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '10:30');
			expect(fixture.componentInstance.model()).toEqual({ hour: 10, minute: 30, second: 0 });
		});
	});

	describe('Custom adapter', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbTimeAdapter, useClass: StringTimeAdapter }],
			});
		});

		it('should display the right time when model is a string parsed by a custom time adapter', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;
			const fixture = await createTestComponent(html);

			fixture.componentInstance.model.set(null);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, ':');

			fixture.componentInstance.model.set('09:25:00');
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '09:25');
		});

		it('should write the entered value as a string formatted by a custom time adapter', async () => {
			const html = `<ngb-timepicker [(ngModel)]="model"></ngb-timepicker>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set(null);
			await fixture.whenStable();

			const inputs = fixture.debugElement.queryAll(By.css('input'));
			inputs[0].triggerEventHandler('change', createChangeEvent('11'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:');
			expect(fixture.componentInstance.model()).toBeNull();

			inputs[1].triggerEventHandler('change', createChangeEvent('5'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '11:05');
			expect(fixture.componentInstance.model()).toEqual('11:05:00');

			inputs[0].triggerEventHandler('change', createChangeEvent('aa'));
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, ':05');
			expect(fixture.componentInstance.model()).toBeNull();
		});
	});

	describe('on push', () => {
		it('should render initial model value', async () => {
			const fixture = await createOnPushTestComponent(
				`<ngb-timepicker [ngModel]="{hour: 13, minute: 30}"></ngb-timepicker>`,
			);
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '13:30');
		});
	});

	describe('on export', () => {
		it('should change active time by calling change on an exported directive instance', async () => {
			const html = `
        <ngb-timepicker #myTimepicker="ngbTimepicker" [ngModel]="model()"></ngb-timepicker>
        <button type="button" id="hours" (click)="myTimepicker.changeHour(1)"></button>
        <button type="button" id="minutes" (click)="myTimepicker.changeMinute(1)"></button>`;

			const fixture = await createTestComponent(html);
			fixture.componentInstance.model.set({ hour: 1, minute: 23, second: 45 });
			await fixture.whenStable();

			const buttonChangeHours = fixture.nativeElement.querySelector('#hours') as HTMLButtonElement;
			buttonChangeHours.click();
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '02:23');

			const buttonChangeMinutes = fixture.nativeElement.querySelector('#minutes') as HTMLButtonElement;
			buttonChangeMinutes.click();
			await fixture.whenStable();
			expectToDisplayTime(fixture.nativeElement, '02:24');
		});
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbTimepicker, FormsModule, ReactiveFormsModule],
	template: '',
})
class TestComponent {
	readonly model = signal<any>(undefined);
	readonly disabled = signal(true);
	readonly readonly = signal(true);
	readonly form = new UntypedFormGroup({ control: new UntypedFormControl('', Validators.required) });
	readonly disabledForm = new UntypedFormGroup({ control: new UntypedFormControl({ value: '', disabled: true }) });
	readonly submitted = signal(false);

	readonly showSeconds = signal(true);

	onSubmit() {
		this.submitted.set(true);
	}
}

@Component({
	selector: 'test-cmp-on-push',
	imports: [NgbTimepicker, FormsModule],
	template: '',
})
class TestComponentOnPush {}

@Injectable()
class StringTimeAdapter extends NgbTimeAdapter<string> {
	fromModel(value: string): NgbTimeStruct | null {
		if (!value) {
			return null;
		}
		const split = value.split(':');
		return { hour: parseInt(split[0], 10), minute: parseInt(split[1], 10), second: parseInt(split[2], 10) };
	}

	toModel(time: NgbTimeStruct): string | null {
		if (!time) {
			return null;
		}
		return `${this.pad(time.hour)}:${this.pad(time.minute)}:${this.pad(time.second)}`;
	}

	private pad(i: number): string {
		return i < 10 ? `0${i}` : `${i}`;
	}
}

@Injectable()
class TestI18n extends NgbTimepickerI18n {
	getMorningPeriod(): string {
		return 'morning';
	}
	getAfternoonPeriod(): string {
		return 'afternoon';
	}
}
