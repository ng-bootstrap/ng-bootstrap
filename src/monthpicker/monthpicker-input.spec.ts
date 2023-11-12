import { TestBed, ComponentFixture, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgIf } from '@angular/common';
import { createGenericTestComponent } from '../test/common';
import createSpy = jasmine.createSpy;

import { Component, Injectable } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { NgbMonth, NgbMonthAdapter, NgbMonthpickerModule } from './monthpicker.module';
import { NgbInputMonthpicker } from './monthpicker-input';
import { NgbMonthpicker } from './monthpicker';
import { NgbMonthStruct } from './ngb-month-struct';
import { NgbInputMonthpickerConfig } from './monthpicker-input-config';
import { Options } from '@popperjs/core';

const createTestCmpt = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

const createTestNativeCmpt = (html: string) =>
	createGenericTestComponent(html, TestNativeComponent) as ComponentFixture<TestNativeComponent>;

function expectSameValues(inputMonthpicker: NgbInputMonthpicker, config: NgbInputMonthpickerConfig) {
	['autoClose', 'container', 'positionTarget', 'placement'].forEach((field) =>
		expect(inputMonthpicker[field]).toEqual(config[field], field),
	);
}

function customizeConfig(config: NgbInputMonthpickerConfig) {
	config.autoClose = 'outside';
	config.container = 'body';
	config.positionTarget = 'positionTarget';
	config.placement = ['bottom-start', 'top-end'];
}

describe('NgbInputMonthpicker', () => {
	it('should initialize inputs with provided monthpicker config', () => {
		const defaultConfig = new NgbInputMonthpickerConfig();
		const fixture = createTestCmpt(`<input ngbMonthpicker>`);

		const inputMonthpicker = fixture.debugElement
			.query(By.directive(NgbInputMonthpicker))
			.injector.get(NgbInputMonthpicker);
		expectSameValues(inputMonthpicker, defaultConfig);
	});

	it('should initialize inputs with provided config', () => {
		// overrideComponent should happen before any injections, so createTestCmpt will fail here
		TestBed.overrideComponent(TestComponent, { set: { template: '<input ngbMonthpicker>' } });
		const config = TestBed.inject(NgbInputMonthpickerConfig);
		customizeConfig(config);
		const fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();

		const inputMonthpicker = fixture.debugElement
			.query(By.directive(NgbInputMonthpicker))
			.injector.get(NgbInputMonthpicker);
		expectSameValues(inputMonthpicker, config);
	});

	it('should work when wrapped in the <label> and toggled with (click)', () => {
		const fixture = createTestCmpt(`
      <label>
        <input ngbMonthpicker #d="ngbMonthpicker" [startDate]="{year: 2018, month: 3}" (click)="d.toggle()">
      </label>`);

		const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

		// open
		dpInput.open();
		fixture.detectChanges();

		// click on a date
		fixture.nativeElement.querySelectorAll('.ngb-mp-day')[3].click(); // 1 MAR 2018
		fixture.detectChanges();

		expect(dpInput.isOpen()).toBe(false);
	});

	describe('Custom config as provider', () => {
		const config = new NgbInputMonthpickerConfig();
		customizeConfig(config);

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbInputMonthpickerConfig, useValue: config }],
			});
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker>`);

			const inputMonthpicker = fixture.debugElement
				.query(By.directive(NgbInputMonthpicker))
				.injector.get(NgbInputMonthpicker);
			expectSameValues(inputMonthpicker, config);
		});
	});

	describe('open, close and toggle', () => {
		it('should allow controlling monthpicker popup from outside', () => {
			const fixture = createTestCmpt(`
          <input ngbMonthpicker #d="ngbMonthpicker">
          <button (click)="open(d)">Open</button>
          <button (click)="close(d)">Close</button>
          <button (click)="toggle(d)">Toggle</button>`);

			const buttons = fixture.nativeElement.querySelectorAll('button');

			buttons[0].click(); // open
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();

			buttons[1].click(); // close
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();

			buttons[2].click(); // toggle
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();

			buttons[2].click(); // toggle
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();
		});

		it('should support the "position" option', () => {
			createTestCmpt(`<input ngbMonthpicker #d="ngbMonthpicker" [placement]="'bottom-right'">`);
		});

		it('should cleanup monthpicker when parent container is destroyed', () => {
			const fixture = createTestCmpt(`
          <ng-template [ngIf]="show">
            <input ngbMonthpicker #d="ngbMonthpicker">
          </ng-template>`);
			const monthpicker = fixture.debugElement
				.query(By.directive(NgbInputMonthpicker))
				.injector.get(NgbInputMonthpicker);

			monthpicker.open();
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();

			const closedSpy = createSpy();
			monthpicker.closed.subscribe(closedSpy);

			fixture.componentInstance.show = false;
			fixture.detectChanges();
			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();
			expect(closedSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('ngModel interactions', () => {
		it('should not change again the value in the model on a change coming from the model (popup closed)', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [(ngModel)]="date">`);
			fixture.detectChanges();

			const input = fixture.nativeElement.querySelector('input');

			const value = new NgbMonth(2018, 8);
			fixture.componentInstance.date = value;

			fixture.detectChanges();
			tick();
			expect(fixture.componentInstance.date).toBe(value);
			expect(input.value).toBe('2018-08-29');
		}));

		it('should not change again the value in the model on a change coming from the model (popup opened)', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [(ngModel)]="date" #d="ngbMonthpicker">
      <button (click)="open(d)">Open</button>`);
			fixture.detectChanges();

			const button = fixture.nativeElement.querySelector('button');
			const input = fixture.nativeElement.querySelector('input');

			button.click(); // open
			tick();
			fixture.detectChanges();

			const value = new NgbMonth(2018, 8);
			fixture.componentInstance.date = value;
			fixture.detectChanges();
			tick();
			expect(fixture.componentInstance.date).toBe(value);
			expect(input.value).toBe('2018-08-29');
		}));

		it('should format bound date as ISO (by default) in the input field', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [ngModel]="date">`);
			const input = fixture.nativeElement.querySelector('input');

			fixture.componentInstance.date = { year: 2016, month: 10 };
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('2016-10-10');

			fixture.componentInstance.date = { year: 2016, month: 10 };
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('2016-10-15');
		}));

		it('should parse user-entered date as ISO (by default)', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [(ngModel)]="date">`);
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			inputDebugEl.triggerEventHandler('input', { target: { value: '2016-09-10' } });
			expect(fixture.componentInstance.date).toEqual({ year: 2016, month: 9 });
		});

		it('should not update the model twice with the same value on input and on change', fakeAsync(() => {
			const fixture = createTestCmpt(
				`<input ngbMonthpicker [(ngModel)]="date" (ngModelChange)="onModelChange($event)">`,
			);
			const componentInstance = fixture.componentInstance;
			const inputDebugEl = fixture.debugElement.query(By.css('input'));
			spyOn(componentInstance, 'onModelChange');

			tick();
			fixture.detectChanges();

			inputDebugEl.triggerEventHandler('input', { target: { value: '2018-08-29' } });
			tick();
			fixture.detectChanges();

			const value = componentInstance.date;
			expect(value).toEqual({ year: 2018, month: 8 });
			expect(componentInstance.onModelChange).toHaveBeenCalledTimes(1);
			expect(componentInstance.onModelChange).toHaveBeenCalledWith(value);

			inputDebugEl.triggerEventHandler('change', { target: { value: '2018-08-29' } });

			tick();
			fixture.detectChanges();

			expect(fixture.componentInstance.date).toBe(value);

			// the value is still the same, there should not be new calls of onModelChange:
			expect(componentInstance.onModelChange).toHaveBeenCalledTimes(1);
		}));

		it('should set only valid dates', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [ngModel]="date">`);
			const input = fixture.nativeElement.querySelector('input');

			fixture.componentInstance.date = <any>{};
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = <any>null;
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = <any>new Date();
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = <any>undefined;
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = new NgbMonth(300000, 1, 1);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = new NgbMonth(2017, 2);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = new NgbMonth(2017, <any>null);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = new NgbMonth(<any>null, 2);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');

			fixture.componentInstance.date = new NgbMonth(<any>'2017', <any>'03');
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('');
		}));

		it('should propagate disabled state', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <input ngbMonthpicker [(ngModel)]="date" #d="ngbMonthpicker" [disabled]="isDisabled">
        <button (click)="open(d)">Open</button>`);
			fixture.componentInstance.isDisabled = true;
			fixture.detectChanges();

			const button = fixture.nativeElement.querySelector('button');
			const input = fixture.nativeElement.querySelector('input');

			button.click(); // open
			tick();
			fixture.detectChanges();
			const buttonInMonthPicker = fixture.nativeElement.querySelector('ngb-monthpicker button');

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();
			expect(input.disabled).toBeTruthy();
			expect(buttonInMonthPicker.disabled).toBeTruthy();

			const dayElements = fixture.nativeElement.querySelectorAll('ngb-monthpicker-month .ngb-mp-day');
			expect(dayElements[1]).toHaveCssClass('disabled');
			expect(dayElements[11]).toHaveCssClass('disabled');
			expect(dayElements[21]).toHaveCssClass('disabled');

			fixture.componentInstance.isDisabled = false;
			fixture.detectChanges();
			tick();
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();
			expect(input.disabled).toBeFalsy();
			expect(buttonInMonthPicker.disabled).toBeFalsy();

			const dayElements2 = fixture.nativeElement.querySelectorAll('ngb-monthpicker-month .ngb-mp-day');
			expect(dayElements2[1]).not.toHaveCssClass('disabled');
			expect(dayElements2[11]).not.toHaveCssClass('disabled');
			expect(dayElements2[21]).not.toHaveCssClass('disabled');
		}));

		it('should propagate disabled state without form control', () => {
			const fixture = createTestCmpt(`
        <input ngbMonthpicker #d="ngbMonthpicker" [disabled]="isDisabled">
        <button (click)="open(d)">Open</button>`);
			fixture.componentInstance.isDisabled = true;
			fixture.detectChanges();

			const button = fixture.nativeElement.querySelector('button');
			const input = fixture.nativeElement.querySelector('input');

			expect(input.disabled).toBeTruthy();

			button.click(); // open
			fixture.detectChanges();
			const buttonInMonthPicker = fixture.nativeElement.querySelector('ngb-monthpicker button');

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();
			expect(input.disabled).toBeTruthy();
			expect(buttonInMonthPicker.disabled).toBeTruthy();

			const dayElements = fixture.nativeElement.querySelectorAll('ngb-monthpicker-month .ngb-mp-day');
			expect(dayElements[1]).toHaveCssClass('disabled');
			expect(dayElements[11]).toHaveCssClass('disabled');
			expect(dayElements[21]).toHaveCssClass('disabled');

			fixture.componentInstance.isDisabled = false;
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).not.toBeNull();
			expect(input.disabled).toBeFalsy();
			expect(buttonInMonthPicker.disabled).toBeFalsy();

			const dayElements2 = fixture.nativeElement.querySelectorAll('ngb-monthpicker-month .ngb-mp-day');
			expect(dayElements2[1]).not.toHaveCssClass('disabled');
			expect(dayElements2[11]).not.toHaveCssClass('disabled');
			expect(dayElements2[21]).not.toHaveCssClass('disabled');
		});

		it('should propagate touched state on (blur)', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [(ngModel)]="date">`);
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			expect(inputDebugEl.classes['ng-touched']).toBeFalsy();

			inputDebugEl.triggerEventHandler('blur', {});
			tick();
			fixture.detectChanges();

			expect(inputDebugEl.classes['ng-touched']).toBeTruthy();
		}));

		it('should propagate touched state when setting a date', fakeAsync(() => {
			const fixture = createTestCmpt(`
      <input ngbMonthpicker [(ngModel)]="date" #d="ngbMonthpicker">
      <button (click)="open(d)">Open</button>`);

			const buttonDebugEl = fixture.debugElement.query(By.css('button'));
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			expect(inputDebugEl.classes['ng-touched']).toBeFalsy();

			buttonDebugEl.triggerEventHandler('click', {}); // open
			inputDebugEl.triggerEventHandler('change', { target: { value: '2016-09-10' } });
			tick();
			fixture.detectChanges();

			expect(inputDebugEl.classes['ng-touched']).toBeTruthy();
		}));

		it('should update model with updateOnBlur when selecting a date', fakeAsync(() => {
			const fixture = createTestCmpt(`
      <input ngbMonthpicker [startDate]="{year: 2018, month: 3}" [(ngModel)]="date" #d="ngbMonthpicker"
             [ngModelOptions]="{updateOn: 'blur'}">`);

			fixture.detectChanges();
			const inputDebugEl = fixture.debugElement.query(By.css('input'));
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			// open
			dpInput.open();
			fixture.detectChanges();
			tick();
			expect(inputDebugEl.classes['ng-touched']).toBeFalsy();
			expect(fixture.componentInstance.date).toBeUndefined();

			// select date
			fixture.nativeElement.querySelectorAll('.ngb-mp-day')[3].click(); // 1 MAR 2018
			fixture.detectChanges();
			expect(fixture.componentInstance.date).toEqual({ year: 2018, month: 3 });
			expect(inputDebugEl.nativeElement.value).toBe('2018-03-01');
			expect(inputDebugEl.classes['ng-touched']).toBeTruthy();
		}));
	});

	describe('manual data entry', () => {
		it('should reformat value entered by a user when it is valid', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker (ngModelChange)="date">`);
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			inputDebugEl.triggerEventHandler('change', { target: { value: '2016-9-1' } });
			tick();
			fixture.detectChanges();

			expect(inputDebugEl.nativeElement.value).toBe('2016-09-01');
		}));

		it('should retain value entered by a user if it is not valid', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker (ngModelChange)="date">`);
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			inputDebugEl.nativeElement.value = '2016-09-aa';
			inputDebugEl.triggerEventHandler('change', { target: { value: inputDebugEl.nativeElement.value } });
			tick();
			fixture.detectChanges();

			expect(inputDebugEl.nativeElement.value).toBe('2016-09-aa');
		}));
	});

	describe('validation', () => {
		describe('values set from model', () => {
			it('should not return errors for valid model', fakeAsync(() => {
				const fixture = createTestCmpt(
					`<form><input ngbMonthpicker [ngModel]="{year: 2017, month: 04, day: 04}" name="mp"></form>`,
				);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();
				expect(form.control.hasError('ngbDate', ['mp'])).toBeFalsy();
			}));

			it('should not return errors for empty model', fakeAsync(() => {
				const fixture = createTestCmpt(`<form><input ngbMonthpicker [ngModel]="date" name="mp"></form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();
			}));

			it('should return "invalid" errors for invalid model', fakeAsync(() => {
				const fixture = createTestCmpt(`<form><input ngbMonthpicker [ngModel]="5" name="mp"></form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
				expect(form.control.getError('ngbDate', ['mp']).invalid).toBe(5);
			}));

			it('should return "minDate" errors for dates before minimal date', fakeAsync(() => {
				const fixture = createTestCmpt(`<form>
          <input ngbMonthpicker [ngModel]="{year: 2017, month: 04, day: 04}" [minDate]="{year: 2017, month: 6, day: 4}" name="mp">
        </form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
				expect(form.control.getError('ngbDate', ['mp']).minDate).toEqual({
					minDate: { year: 2017, month: 6, day: 4 },
					actual: { year: 2017, month: 4, day: 4 },
				});
			}));

			it('should return "maxDate" errors for dates after maximal date', fakeAsync(() => {
				const fixture = createTestCmpt(`<form>
          <input ngbMonthpicker [ngModel]="{year: 2017, month: 04, day: 04}" [maxDate]="{year: 2017, month: 2, day: 4}" name="mp">
        </form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
				expect(form.control.getError('ngbDate', ['mp']).maxDate).toEqual({
					maxDate: { year: 2017, month: 2, day: 4 },
					actual: { year: 2017, month: 4, day: 4 },
				});
			}));

			it('should update validity status when model changes', fakeAsync(() => {
				const fixture = createTestCmpt(`<form><input ngbMonthpicker [ngModel]="date" name="mp"></form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.componentRef.instance.date = <any>'invalid';
				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();

				fixture.componentRef.instance.date = { year: 2015, month: 7 };
				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();
			}));

			it('should update validity status when minDate changes', fakeAsync(() => {
				const fixture = createTestCmpt(`<form>
          <input ngbMonthpicker [ngModel]="{year: 2017, month: 2, day: 4}" [minDate]="date" name="mp">
        </form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();

				fixture.componentRef.instance.date = { year: 2018, month: 7 };
				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
			}));

			it('should update validity status when maxDate changes', fakeAsync(() => {
				const fixture = createTestCmpt(`<form>
          <input ngbMonthpicker [ngModel]="{year: 2017, month: 2, day: 4}" [maxDate]="date" name="mp">
        </form>`);
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();

				fixture.componentRef.instance.date = { year: 2015, month: 7 };
				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
			}));

			it('should update validity for manually entered dates', fakeAsync(() => {
				const fixture = createTestCmpt(`<form><input ngbMonthpicker [(ngModel)]="date" name="mp"></form>`);
				const inputDebugEl = fixture.debugElement.query(By.css('input'));
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				inputDebugEl.triggerEventHandler('input', { target: { value: '2016-09-10' } });
				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();

				inputDebugEl.triggerEventHandler('input', { target: { value: 'invalid' } });
				fixture.detectChanges();
				tick();
				expect(form.control.invalid).toBeTruthy();
			}));

			it('should consider empty strings as valid', fakeAsync(() => {
				const fixture = createTestCmpt(`<form><input ngbMonthpicker [(ngModel)]="date" name="mp"></form>`);
				const inputDebugEl = fixture.debugElement.query(By.css('input'));
				const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);

				inputDebugEl.triggerEventHandler('change', { target: { value: '2016-09-10' } });
				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();

				inputDebugEl.triggerEventHandler('change', { target: { value: '' } });
				fixture.detectChanges();
				tick();
				expect(form.control.valid).toBeTruthy();
			}));
		});
	});

	describe('options', () => {
		it('should propagate the "monthTemplate" option', () => {
			const fixture = createTestCmpt(`<ng-template #t></ng-template><input ngbMonthpicker [monthTemplate]="t">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.monthTemplate).toBeDefined();
		});

		it('should propagate the "contentTemplate" option', () => {
			const fixture = createTestCmpt(`<ng-template #t></ng-template><input ngbMonthpicker [contentTemplate]="t">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.contentTemplate).toBeDefined();
		});

		it('should propagate the "monthTemplateData" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [monthTemplateData]="noop">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.monthTemplateData).toBeDefined();
		});

		it('should propagate the "displayYears" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [displayYears]="3">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.displayYears).toBe(3);
		});

		it('should propagate the "footerTemplate" option', () => {
			const fixture = createTestCmpt(`<ng-template #t></ng-template><input ngbMonthpicker [footerTemplate]="t">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.footerTemplate).toBeDefined();
		});

		it('should propagate the "markDisabled" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [markDisabled]="noop">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.markDisabled).toBeDefined();
		});

		it('should propagate the "minDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [minDate]="{year: 2016, month: 9}">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.minDate).toEqual({ year: 2016, month: 9 });
		});

		it('should propagate the "maxDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [maxDate]="{year: 2016, month: 9}">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.maxDate).toEqual({ year: 2016, month: 9 });
		});

		it('should dynamically propagate the "minDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [minDate]="minDate">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			fixture.componentRef.instance.minDate = { year: 2018, month: 12 };

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.minDate).toEqual({ year: 2018, month: 12 });

			fixture.componentRef.instance.minDate = { year: 2019, month: 11 };
			fixture.detectChanges();
			expect(mp.minDate).toEqual({ year: 2019, month: 11 });
		});

		it('should dynamically propagate the "maxDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [maxDate]="maxDate">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });

			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };
			fixture.detectChanges();
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });
		});

		it('should dynamically propagate the "maxDate" and "minDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [minDate]="minDate" [maxDate]="maxDate">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			fixture.componentRef.instance.minDate = { year: 2019, month: 11 };
			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.minDate).toEqual({ year: 2019, month: 11 });
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });

			fixture.componentRef.instance.minDate = { year: 2019, month: 10 };
			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };
			fixture.detectChanges();

			expect(mp.minDate).toEqual({ year: 2019, month: 10 });
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });
		});

		it('should propagate the "navigation" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker navigation="none">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.navigation).toBe('none');
		});

		it('should propagate the "startDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [startDate]="{year: 2016, month: 9}">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.startDate).toEqual({ year: 2016, month: 9 });
		});

		it('should propagate model as "startDate" option when "startDate" not provided', fakeAsync(() => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [ngModel]="{year: 2016, month: 9}">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			tick();
			fixture.detectChanges();
			dpInput.open();

			fixture.detectChanges();
			tick();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.startDate).toEqual(new NgbMonth(2016, 9, 13));
		}));

		it('should relay the "navigate" event', () => {
			const fixture = createTestCmpt(
				`<input ngbMonthpicker [startDate]="{year: 2016, month: 9}" (navigate)="onNavigate($event)">`,
			);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			spyOn(fixture.componentInstance, 'onNavigate');

			dpInput.open();
			fixture.detectChanges();
			expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
				current: null,
				next: { year: 2016, month: 9 },
				preventDefault: jasmine.any(Function),
			});

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			mp.navigateTo({ year: 2018, month: 4 });
			expect(fixture.componentInstance.onNavigate).toHaveBeenCalledWith({
				current: { year: 2016, month: 9 },
				next: { year: 2018, month: 4 },
				preventDefault: jasmine.any(Function),
			});
		});

		it('should relay the "closed" event', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker (closed)="onClose()">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			spyOn(fixture.componentInstance, 'onClose');

			// open
			dpInput.open();
			fixture.detectChanges();

			// close
			dpInput.close();
			expect(fixture.componentInstance.onClose).toHaveBeenCalledTimes(1);
		});

		it('should emit both "dateSelect" and "onModelChange" events', () => {
			const fixture = createTestCmpt(`
          <input ngbMonthpicker ngModel [startDate]="{year: 2018, month: 3}"
          (ngModelChange)="onModelChange($event)" (dateSelect)="onDateSelect($event)">`);

			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			spyOn(fixture.componentInstance, 'onDateSelect');
			spyOn(fixture.componentInstance, 'onModelChange');

			// open
			dpInput.open();
			fixture.detectChanges();

			// click on a date
			fixture.nativeElement.querySelectorAll('.ngb-mp-day')[3].click(); // 1 MAR 2018
			fixture.detectChanges();
			expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(1);
			expect(fixture.componentInstance.onModelChange).toHaveBeenCalledTimes(1);

			// open again
			dpInput.open();
			fixture.detectChanges();

			// click the same date
			fixture.nativeElement.querySelectorAll('.ngb-mp-day')[3].click(); // 1 MAR 2018
			fixture.detectChanges();
			expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledTimes(2);
			expect(fixture.componentInstance.onModelChange).toHaveBeenCalledTimes(1);

			expect(fixture.componentInstance.onDateSelect).toHaveBeenCalledWith(new NgbMonth(2018, 3));
			expect(fixture.componentInstance.onModelChange).toHaveBeenCalledWith({ year: 2018, month: 3 });
		});

		it('should add custom popup class via "popupClass" input', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker #d="ngbMonthpicker" [monthpickerClass]="popupClass">`);
			fixture.detectChanges();
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			dpInput.open();

			// initial value
			let element = document.querySelector('ngb-monthpicker') as HTMLElement;
			expect(element).not.toBeNull();
			expect(element).toHaveCssClass('my-monthpicker-popup');
			expect(element).not.toHaveCssClass('my-another-monthpicker-popup');

			// empty value
			fixture.componentInstance.popupClass = '';
			fixture.detectChanges();
			expect(element).not.toHaveCssClass('my-monthpicker-popup');
			expect(element).not.toHaveCssClass('my-another-monthpicker-popup');

			// another value
			fixture.componentInstance.popupClass = 'my-another-monthpicker-popup';
			fixture.detectChanges();
			expect(element).not.toHaveCssClass('my-monthpicker-popup');
			expect(element).toHaveCssClass('my-another-monthpicker-popup');
		});
	});

	describe('container', () => {
		it('should be appended to the element matching the selector passed to "container"', () => {
			const selector = 'body';
			const fixture = createTestCmpt(`
          <input ngbMonthpicker #d="ngbMonthpicker" container="${selector}">
          <button (click)="open(d)">Open</button>
      `);

			// open date-picker
			const button = fixture.nativeElement.querySelector('button');
			button.click();
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();
			expect(document.querySelector(selector)!.querySelector('ngb-monthpicker')).not.toBeNull();
		});

		it('should properly destroy monthpicker window when the "container" option is used', () => {
			const selector = 'body';
			const fixture = createTestCmpt(`
          <input ngbMonthpicker #d="ngbMonthpicker" container="${selector}">
          <button (click)="open(d)">Open</button>
          <button (click)="close(d)">Close</button>
      `);

			// open date-picker
			const buttons = fixture.nativeElement.querySelectorAll('button');
			buttons[0].click(); // open button
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();
			expect(document.querySelector(selector)!.querySelector('ngb-monthpicker')).not.toBeNull();

			// close date-picker
			buttons[1].click(); // close button
			fixture.detectChanges();

			expect(fixture.nativeElement.querySelector('ngb-monthpicker')).toBeNull();
			expect(document.querySelector(selector)!.querySelector('ngb-monthpicker')).toBeNull();
		});

		it('should add .ngb-mp-body class when attached to body', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker #d="ngbMonthpicker" [container]="container">`);
			fixture.detectChanges();
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);

			// No container specified
			dpInput.open();

			let element = document.querySelector('ngb-monthpicker') as HTMLElement;
			expect(element).not.toBeNull();
			expect(element).not.toHaveCssClass('ngb-mp-body');

			// Body
			dpInput.close();
			fixture.componentInstance.container = 'body';
			fixture.detectChanges();
			dpInput.open();

			element = document.querySelector('ngb-monthpicker') as HTMLElement;
			expect(element).not.toBeNull();
			expect(element).toHaveCssClass('ngb-mp-body');
		});

		it('should not scroll when opening monthpicker attached to body', waitForAsync(() => {
			const fixture = createTestCmpt(`
      <input ngbMonthpicker container="body"/>
      <div style="height: 10000px"></div>
    `);

			expect(document.documentElement.scrollTop).toBe(0);

			// open monthpicker
			const mp = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			mp.open();
			fixture.detectChanges();

			// browser starts scrolling if focus was set before popper positioning
			setTimeout(() => expect(document.documentElement.scrollTop).toBe(0), 10);
		}));

		it('should modify the popper options', (done) => {
			const fixture = createTestCmpt(`
        <input ngbMonthpicker container="body"/>
        <div style="height: 10000px"></div>
      `);
			const monthpickerInput = fixture.debugElement
				.query(By.directive(NgbInputMonthpicker))
				.injector.get(NgbInputMonthpicker);

			const spy = createSpy();
			monthpickerInput.popperOptions = (options: Partial<Options>) => {
				options.modifiers!.push({ name: 'test', enabled: true, phase: 'main', fn: spy });
				return options;
			};
			monthpickerInput.open();

			queueMicrotask(() => {
				expect(spy).toHaveBeenCalledTimes(1);
				done();
			});
		});
	});

	describe('focus restore', () => {
		function open(fixture: ComponentFixture<TestComponent>) {
			const mp = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			mp.open();
			tick();
			fixture.detectChanges();
		}

		function selectDateAndClose(fixture: ComponentFixture<TestComponent>) {
			fixture.nativeElement.querySelectorAll('.ngb-mp-day')[3].click(); // 1 MAR 2018
			fixture.detectChanges();
		}

		it('should focus previously focused element', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div tabindex="0" id="focusable"></div>
        <input ngbMonthpicker [startDate]="{year: 2018, month: 3}"/>
      `);

			// initial focus
			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			focusableEl.focus();
			expect(document.activeElement).toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(focusableEl);
		}));

		it('should focus using selector provided via [restoreFocus]', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div tabindex="0" id="focusable"></div>
        <input ngbMonthpicker restoreFocus="#focusable" [startDate]="{year: 2018, month: 3}"/>
      `);

			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			expect(document.activeElement).not.toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(focusableEl);
		}));

		it('should focus using element provided via [restoreFocus]', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div #el tabindex="0" id="focusable"></div>
        <input ngbMonthpicker [restoreFocus]="el" [startDate]="{year: 2018, month: 3}"/>
      `);

			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			expect(document.activeElement).not.toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(focusableEl);
		}));

		it('should fallback to body if [restoreFocus] selector is invalid', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div tabindex="0" id="focusable"></div>
        <input ngbMonthpicker restoreFocus=".invalid-element" [startDate]="{year: 2018, month: 3}"/>
      `);

			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			focusableEl.focus();
			expect(document.activeElement).toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(document.body);
		}));

		it('should fallback to body if [restoreFocus] value is falsy', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div tabindex="0" id="focusable"></div>
        <input ngbMonthpicker [restoreFocus]="null" [startDate]="{year: 2018, month: 3}"/>
      `);

			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			focusableEl.focus();
			expect(document.activeElement).toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(document.body);
		}));

		it('should fallback to body if [restoreFocus] value is truthy', fakeAsync(() => {
			const fixture = createTestCmpt(`
        <div tabindex="0" id="focusable"></div>
        <input ngbMonthpicker [restoreFocus]="true" [startDate]="{year: 2018, month: 3}"/>
      `);

			const focusableEl = fixture.nativeElement.querySelector('#focusable');
			focusableEl.focus();
			expect(document.activeElement).toBe(focusableEl);

			open(fixture);
			expect(document.activeElement).not.toBe(focusableEl);

			selectDateAndClose(fixture);
			expect(document.activeElement).toBe(document.body);
		}));
	});

	describe('Native adapter', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbMonthAdapter, useClass: NgbMonthNativeAdapter }],
			});
		});

		it('should format bound date as ISO (by default) in the input field', fakeAsync(() => {
			const fixture = createTestNativeCmpt(`<input ngbMonthpicker [ngModel]="date">`);
			const input = fixture.nativeElement.querySelector('input');

			fixture.componentInstance.date = new Date(2018, 0, 3);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('2018-01-03');

			fixture.componentInstance.date = new Date(2018, 10, 13);
			fixture.detectChanges();
			tick();
			expect(input.value).toBe('2018-11-13');
		}));

		it('should parse user-entered date as ISO (by default)', () => {
			const fixture = createTestNativeCmpt(`<input ngbMonthpicker [(ngModel)]="date">`);
			const inputDebugEl = fixture.debugElement.query(By.css('input'));

			inputDebugEl.triggerEventHandler('input', { target: { value: '2018-01-03' } });
			expect(fixture.componentInstance.date).toEqual(new Date(2018, 0, 3));
		});

		it('should dynamically propagate the "maxDate" and "minDate" option', () => {
			const fixture = createTestCmpt(`<input ngbMonthpicker [minDate]="minDate" [maxDate]="maxDate">`);
			const dpInput = fixture.debugElement.query(By.directive(NgbInputMonthpicker)).injector.get(NgbInputMonthpicker);
			fixture.componentRef.instance.minDate = { year: 2019, month: 11 };
			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };

			dpInput.open();
			fixture.detectChanges();

			const mp = fixture.debugElement.query(By.css('ngb-monthpicker')).injector.get(NgbMonthpicker);
			expect(mp.minDate).toEqual({ year: 2019, month: 11 });
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });

			fixture.componentRef.instance.minDate = { year: 2019, month: 10 };
			fixture.componentRef.instance.maxDate = { year: 2019, month: 12 };
			fixture.detectChanges();

			expect(mp.minDate).toEqual({ year: 2019, month: 10 });
			expect(mp.maxDate).toEqual({ year: 2019, month: 12 });
		});
	});
});

@Injectable()
class NgbMonthNativeAdapter extends NgbMonthAdapter<Date> {
	fromModel(date: Date): NgbMonthStruct | null {
		return date && date.getFullYear ? { year: date.getFullYear(), month: date.getMonth() + 1 } : null;
	}

	toModel(date: NgbMonthStruct): Date | null {
		return date ? new Date(date.year, date.month - 1) : null;
	}
}

@Component({
	selector: 'test-native-cmp',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule],
	template: '',
})
class TestNativeComponent {
	date: Date;
}

@Component({
	selector: 'test-cmp',
	standalone: true,
	imports: [NgbMonthpickerModule, FormsModule, NgIf],
	template: '',
})
class TestComponent {
	container;
	date: NgbMonthStruct;
	minDate: NgbMonthStruct;
	maxDate: NgbMonthStruct;
	isDisabled;
	popupClass = 'my-monthpicker-popup';
	show = true;

	onNavigate(params) {}

	onDateSelect(date) {}

	onModelChange(value) {}

	onClose() {}

	open(d: NgbInputMonthpicker) {
		d.open();
	}

	close(d: NgbInputMonthpicker) {
		d.close();
	}

	toggle(d: NgbInputMonthpicker) {
		d.toggle();
	}

	noop() {}
}
