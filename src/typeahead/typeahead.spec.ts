import { Component, DebugElement, signal, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Options } from '@popperjs/core';
import { merge, Observable, of, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';

import { createGenericAsyncTestComponent, triggerEvent } from '../test/common';
import { expectResults, getWindowLinks } from '../test/typeahead/common';
import { ARIA_LIVE_DELAY } from '../utils/public-api';
import { NgbTypeaheadConfig } from './typeahead-config';
import { NgbHighlight } from './highlight';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NgbTypeahead } from './typeahead';

const createTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestComponent);

const createOnPushTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestOnPushComponent);

const createAsyncTestComponent = (html: string) => createGenericAsyncTestComponent(html, TestAsyncComponent);

function createKeyDownEvent(key: string) {
	const event = { key, preventDefault: () => {}, stopPropagation: () => {} };
	vi.spyOn(event, 'preventDefault');
	vi.spyOn(event, 'stopPropagation');
	return event;
}

function getWindow(element): HTMLDivElement {
	return <HTMLDivElement>element.querySelector('ngb-typeahead-window.dropdown-menu');
}

function getDebugInput(element: DebugElement): DebugElement {
	return element.query(By.directive(NgbTypeahead));
}

function getNativeInput(element: HTMLElement): HTMLInputElement {
	return <HTMLInputElement>element.querySelector('input');
}

function changeInput(element: any, value: string) {
	const input = getNativeInput(element);
	input.value = value;
	triggerEvent(input, 'input');
}

function blurInput(element: any) {
	triggerEvent(getNativeInput(element), 'blur');
}

function expectInputValue(element: HTMLElement, value: string) {
	expect(getNativeInput(element).value).toBe(value);
}

function expectWindowResults(element, expectedResults: string[]) {
	const window = getWindow(element);
	expect(window).not.toBeNull();
	expectResults(window, expectedResults);
}

describe('ngb-typeahead', () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		TestBed.configureTestingModule({
			providers: [{ provide: ARIA_LIVE_DELAY, useValue: null }],
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('valueaccessor', () => {
		it('should format values when no formatter provided', async () => {
			const fixture = await createTestComponent('<input [(ngModel)]="model" [ngbTypeahead]="findNothing" />');

			const el = fixture.nativeElement;
			const comp = fixture.componentInstance;
			expectInputValue(el, '');

			comp.model.set('text');
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, 'text');

			comp.model.set(null);
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, '');

			comp.model.set({});
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, '[object Object]');
		});

		it('should format values with custom formatter provided', async () => {
			const html = '<input [(ngModel)]="model" [ngbTypeahead]="findNothing" [inputFormatter]="uppercaseObjFormatter"/>';
			const fixture = await createTestComponent(html);
			const el = fixture.nativeElement;
			const comp = fixture.componentInstance;
			expectInputValue(el, '');

			comp.model.set(null);
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, '');

			comp.model.set({ value: 'text' });
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, 'TEXT');
		});

		it('should use custom input formatter with falsy values', async () => {
			const html = '<input [(ngModel)]="model" [ngbTypeahead]="findNothing" [inputFormatter]="uppercaseFormatter"/>';
			const fixture = await createTestComponent(html);
			const el = fixture.nativeElement;
			const comp = fixture.componentInstance;
			expectInputValue(el, '');

			comp.model.set(null);
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, '');

			comp.model.set(0);
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, '0');

			comp.model.set(false);
			await fixture.whenStable();
			await fixture.whenStable();
			expectInputValue(el, 'FALSE');
		});
	});

	describe('window', () => {
		it('should be closed by default', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			expect(getWindow(compiled)).toBeNull();
		});

		it('should not be opened when the model changes', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			fixture.componentInstance.model.set('one');
			await fixture.whenStable();
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
		});

		it('should be opened when there are results', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			changeInput(compiled, 'one');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(fixture.componentInstance.model()).toBe('one');
		});

		it('should be closed when there no results', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="findNothing"/>`);
			const compiled = fixture.nativeElement;

			expect(getWindow(compiled)).toBeNull();
		});

		it('should accept "null" as ngbTypeahead value', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="null"/>`);
			const compiled = fixture.nativeElement;
			expect(getWindow(compiled)).toBeNull();
		});

		it('should accept "undefined" as ngbTypeahead value', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="undefined"/>`);
			const compiled = fixture.nativeElement;
			expect(getWindow(compiled)).toBeNull();
		});

		it('should allow changing ngbTypeahead value', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="findRef()"/>`);
			const compiled = fixture.nativeElement;

			// null initially
			expect(getWindow(compiled)).toBeNull();

			// real value
			fixture.componentInstance.findRef.set((_) => of(['one', 'one more']));
			await fixture.whenStable();

			changeInput(compiled, 'one');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);

			// back to null
			fixture.componentInstance.findRef.set(undefined);
			await fixture.whenStable();

			expect(getWindow(compiled)).toBeNull();
		});

		it('should work when returning null as results', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="findNull"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'one');
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
		});

		it('should select the result on click, close window and fill the input', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			// clicking selected
			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);

			getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expectInputValue(compiled, 'one');
			expect(fixture.componentInstance.model()).toBe('one');

			// clicking not selected
			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expectInputValue(compiled, 'o');

			getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expectInputValue(compiled, 'one');
		});

		it('should select the result on ENTER, close window and fill the input', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);

			const event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expectInputValue(compiled, 'one');
			expect(fixture.componentInstance.model()).toBe('one');
			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
		});

		it('should select the result on TAB, close window and fill the input', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getWindow(compiled)).not.toBeNull();

			const event = createKeyDownEvent('Tab');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expectInputValue(compiled, 'one');
			expect(fixture.componentInstance.model()).toBe('one');
			expect(event.preventDefault).toHaveBeenCalled();
			expect(event.stopPropagation).toHaveBeenCalled();
		});

		it('should make previous/next results active with up/down arrow keys', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);

			// down
			let event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', '+one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			// up
			event = createKeyDownEvent('ArrowUp');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', '+one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			event = createKeyDownEvent('ArrowUp');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should use provided result formatter function', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [ngbTypeahead]="find" [resultFormatter]="uppercaseFormatter"/>`,
			);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+ONE', 'ONE MORE']);
		});

		it('should not mark first result as active when focusFirst is false', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find" [focusFirst]="false"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', 'one more']);
		});

		it('should reset active index when result changes', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);

			// move down to highlight the second item
			let event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', '+one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			// change search criteria to reset results while the popup stays open
			changeInput(compiled, 't');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+two', 'three']);
		});

		it('should properly make previous/next results active with down arrow keys when focusFirst is false', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find" [focusFirst]="false"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', 'one more']);

			// down
			let event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', '+one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', 'one more']);
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should properly make previous/next results active with up arrow keys when focusFirst is false', async () => {
			const fixture = await createTestComponent(`<input type="text" [ngbTypeahead]="find" [focusFirst]="false"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', 'one more']);

			// up
			let event = createKeyDownEvent('ArrowUp');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', '+one more']);
			expect(event.preventDefault).toHaveBeenCalled();

			event = createKeyDownEvent('ArrowUp');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(event.preventDefault).toHaveBeenCalled();
		});

		it('should not select the result on TAB, close window and not write to the input when focusFirst is false', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" [focusFirst]="false"/>`,
			);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getWindow(compiled)).not.toBeNull();

			const event = createKeyDownEvent('Tab');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expectInputValue(compiled, 'o');
			expect(fixture.componentInstance.model()).toBe('o');
			expect(event.preventDefault).not.toHaveBeenCalled();
		});

		it('should properly display results when an owning components using OnPush strategy', async () => {
			const fixture = await createOnPushTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			changeInput(compiled, 'o');
			await fixture.whenStable();
			vi.advanceTimersByTime(250);
			expectWindowResults(compiled, ['+one', 'one more']);
		});

		it('should apply additional class when specified', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" popupClass="test"/>`,
			);
			const compiled = fixture.nativeElement;

			// the results of the code below are already tested above
			changeInput(compiled, 'one');
			await fixture.whenStable();

			const win = getWindow(compiled);
			expect(win.classList).toContain('test');
		});

		it('should apply additional classes when specified', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" popupClass="test other"/>`,
			);
			const compiled = fixture.nativeElement;

			// the results of the code below are already tested above
			changeInput(compiled, 'one');
			await fixture.whenStable();

			const win = getWindow(compiled);
			expect(win.classList).toContain('test');
			expect(win.classList).toContain('other');
		});

		it('should modify the popper options', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" />`);

			const typeahead = fixture.debugElement.query(By.directive(NgbTypeahead)).injector.get(NgbTypeahead);

			const spy = vi.fn();
			typeahead.popperOptions = (options: Partial<Options>) => {
				options.modifiers!.push({ name: 'test', enabled: true, phase: 'main', fn: spy });
				return options;
			};
			const compiled = fixture.nativeElement;
			changeInput(compiled, 'one');

			queueMicrotask(() => {
				expect(spy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('with async typeahead function', () => {
		it('should not display results when input is "blured"', async () => {
			const fixture = await createAsyncTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'one');
			await fixture.whenStable();

			vi.advanceTimersByTime(50);

			blurInput(compiled);
			await fixture.whenStable();

			vi.advanceTimersByTime(250);
			expect(getWindow(compiled)).toBeNull();

			// Make sure that it is resubscribed again
			changeInput(compiled, 'two');
			await fixture.whenStable();
			vi.advanceTimersByTime(250);
			expect(getWindow(compiled)).not.toBeNull();
		});

		it('should not display results when value selected while new results are been loading', async () => {
			const fixture = await createAsyncTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;

			// Change input first time
			changeInput(compiled, 'one');
			await fixture.whenStable();

			// Results for first input are loaded
			vi.advanceTimersByTime(250);
			expect(getWindow(compiled)).not.toBeNull();

			// Change input second time
			changeInput(compiled, 'two');
			await fixture.whenStable();
			vi.advanceTimersByTime(50);

			// Select a value from first results list while second is still in progress
			getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();

			// Results for second input are loaded (window shouldn't be opened in this case)
			vi.advanceTimersByTime(250);
			expect(getWindow(compiled)).toBeNull();

			// Make sure that it is resubscribed again
			changeInput(compiled, 'three');
			await fixture.whenStable();
			vi.advanceTimersByTime(250);
			expect(getWindow(compiled)).not.toBeNull();
		});
	});

	describe('objects', () => {
		it('should work with custom objects as values', async () => {
			const fixture = await createTestComponent(`
             <input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
                    [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`);
			const compiled = fixture.nativeElement;
			await fixture.whenStable();

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+ONE', 'ONE MORE']);

			const event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expect(getNativeInput(compiled).value).toBe('1 one');
			expect(fixture.componentInstance.model()).toEqual({ id: 1, value: 'one' });
		});

		it('should allow to assign ngModel custom objects', async () => {
			const fixture = await createTestComponent(`
             <input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
                    [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`);
			const compiled = fixture.nativeElement;

			fixture.componentInstance.model.set({ id: 1, value: 'one' });
			await fixture.whenStable();
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expect(getNativeInput(compiled).value).toBe('1 one');
		});
	});

	describe('forms', () => {
		it('should work with template-driven form validation', async () => {
			const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" required [ngbTypeahead]="findObjects" />
            </form>`;
			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should work with model-driven form validation', async () => {
			const html = `
           <form [formGroup]="form">
             <input type="text" formControlName="control" required [ngbTypeahead]="findObjects" />
           </form>`;
			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;

			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
		});

		it('should support disabled state', async () => {
			const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" [disabled]="true" [ngbTypeahead]="findObjects" />
            </form>`;
			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			expect(getNativeInput(compiled).disabled).toBeTruthy();
		});

		it('should only propagate model changes on select when the editable option is on', async () => {
			const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" required [ngbTypeahead]="find" [editable]="false"/>
            </form>`;
			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBeNull();

			const event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBe('one');
		});

		it('should clear model on user input when the editable option is on', async () => {
			const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" required [ngbTypeahead]="find" [editable]="false"/>
            </form>`;
			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBeNull();

			const event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBe('one');

			changeInput(compiled, 'tw');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBeNull();
		});

		it('should clear model on user input when the editable option is on and no search was triggered', async () => {
			const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" required [ngbTypeahead]="findFilter" [editable]="false"/>
            </form>`;
			const fixture = await createTestComponent(html);
			await fixture.whenStable();
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

			changeInput(compiled, 'one');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBeNull();

			const event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBe('one');

			changeInput(compiled, '');
			await fixture.whenStable();
			expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
			expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');
			expect(fixture.componentInstance.model()).toBeNull();
		});

		it('should use null and not undefined as value to make sure the form group value is valid (issue 4777)', async () => {
			const html = `
           <form [formGroup]="form">
             <input type="text" formControlName="control" [ngbTypeahead]="findObjects" [editable]="false" />
           </form>`;
			const fixture = await createTestComponent(html);
			const compiled = fixture.nativeElement;

			changeInput(compiled, 'o');
			await fixture.whenStable();

			const formValue = fixture.componentInstance.form.getRawValue();
			expect(formValue.control).toBeNull();

			expect(() => fixture.componentInstance.form.setValue(formValue)).not.toThrow();
		});
	});

	describe('select event', () => {
		it('should raise select event when a result is selected', async () => {
			const fixture = await createTestComponent('<input [ngbTypeahead]="find" (selectItem)="onSelect($event.item)"/>');

			// clicking selected
			changeInput(fixture.nativeElement, 'o');
			await fixture.whenStable();
			getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
			await fixture.whenStable();

			expect(fixture.componentInstance.selectEventValue()).toBe('one');
		});

		it('should not propagate model when preventDefault() is called on selectEvent', async () => {
			const fixture = await createTestComponent(
				'<input [(ngModel)]="model" [ngbTypeahead]="find" (selectItem)="$event.preventDefault()"/>',
			);
			await fixture.whenStable();

			// clicking selected
			changeInput(fixture.nativeElement, 'o');
			await fixture.whenStable();
			getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
			await fixture.whenStable();
			expect(fixture.componentInstance.model()).toBe('o');
		});
	});

	describe('container', () => {
		it('should be appended to the element matching the selector passed to "container"', async () => {
			const selector = 'body';
			const fixture = await createTestComponent(`<input [ngbTypeahead]="find" container="${selector}"/>`);

			changeInput(fixture.nativeElement, 'one');
			await fixture.whenStable();

			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(getWindow(document.querySelector(selector))).not.toBeNull();
		});

		it('should properly destroy typeahead window when the "container" option is used', async () => {
			const selector = 'body';
			const fixture = await createTestComponent(`@if (show()) {
					<input [ngbTypeahead]="find" container="${selector}"/>
				}`);

			changeInput(fixture.nativeElement, 'one');
			await fixture.whenStable();

			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(getWindow(document.querySelector(selector))).not.toBeNull();

			fixture.componentInstance.show.set(false);
			await fixture.whenStable();

			expect(getWindow(fixture.nativeElement)).toBeNull();
			expect(getWindow(document.querySelector(selector))).toBeNull();
		});
	});

	describe('auto attributes', () => {
		it('should have autocomplete, autocapitalize and autocorrect attributes set to off', async () => {
			const fixture = await createTestComponent('<input type="text" [ngbTypeahead]="findObjects" />');
			const input = getNativeInput(fixture.nativeElement);

			expect(input.getAttribute('autocomplete')).toBe('off');
			expect(['off', 'none']).toContain(input.getAttribute('autocapitalize')!);
			expect(input.getAttribute('autocorrect')).toBe('off');
		});

		it('should have configurable autocomplete attribute', async () => {
			const fixture = await createTestComponent(
				'<input type="text" [ngbTypeahead]="findObjects" autocomplete="ignored-123456"/>',
			);
			const input = getNativeInput(fixture.nativeElement);

			expect(input.getAttribute('autocomplete')).toBe('ignored-123456');
		});
	});

	describe('accessibility', () => {
		it('should have correct role, aria-autocomplete, aria-expanded set by default', async () => {
			const fixture = await createTestComponent('<input type="text" [ngbTypeahead]="findObjects" />');
			const input = getNativeInput(fixture.nativeElement);

			await fixture.whenStable();

			expect(input.getAttribute('role')).toBe('combobox');
			expect(input.getAttribute('aria-autocomplete')).toBe('list');
			expect(input.getAttribute('aria-expanded')).toBe('false');
			expect(input.getAttribute('aria-controls')).toBeNull();
			expect(input.getAttribute('aria-autocomplete')).toBe('list');
			expect(input.getAttribute('aria-activedescendant')).toBeNull();
		});

		it('should correctly set aria-autocomplete depending on showHint', async () => {
			const fixture = await createTestComponent(
				'<input type="text" [ngbTypeahead]="findObjects"  [showHint]="true" />',
			);
			const input = getNativeInput(fixture.nativeElement);

			await fixture.whenStable();

			expect(input.getAttribute('aria-autocomplete')).toBe('both');
		});

		it('should have the correct ARIA attributes when interacting with input', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
			const compiled = fixture.nativeElement;
			const input = getNativeInput(compiled);
			await fixture.whenStable();

			changeInput(compiled, 'o');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(input.getAttribute('aria-expanded')).toBe('true');
			expect(input.getAttribute('aria-controls')).toMatch(/ngb-typeahead-[0-9]+/);
			expect(input.getAttribute('aria-activedescendant')).toMatch(/ngb-typeahead-[0-9]+-0/);

			let event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(input.getAttribute('aria-activedescendant')).toMatch(/ngb-typeahead-[0-9]+-1/);

			event = createKeyDownEvent('Enter');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(input.getAttribute('aria-expanded')).toBe('false');
			expect(input.getAttribute('aria-controls')).toBeNull();
			expect(input.getAttribute('aria-activedescendant')).toBeNull();
		});
	});

	describe('hint', () => {
		it('should show hint when an item starts with user input', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="findAnywhere" [showHint]="true"/>`,
			);
			const compiled = fixture.nativeElement;
			const inputEl = getNativeInput(compiled);

			await fixture.whenStable();

			changeInput(compiled, 'on');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(inputEl.value).toBe('one');
			expect(inputEl.selectionStart).toBe(2);
			expect(inputEl.selectionEnd).toBe(3);

			const event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(inputEl.value).toBe('one more');
			expect(inputEl.selectionStart).toBe(2);
			expect(inputEl.selectionEnd).toBe(8);
		});

		it('should show hint with no selection when an item does not starts with user input', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="findAnywhere" [showHint]="true"/>`,
			);
			const compiled = fixture.nativeElement;
			const inputEl = getNativeInput(compiled);
			await fixture.whenStable();

			changeInput(compiled, 'ne');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(inputEl.value).toBe('one');
			expect(inputEl.selectionStart).toBe(inputEl.selectionEnd);

			const event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(inputEl.value).toBe('one more');
			expect(inputEl.selectionStart).toBe(inputEl.selectionEnd);
		});

		it('should take input formatter into account when displaying hints', async () => {
			const fixture = await createTestComponent(`<input type="text" [(ngModel)]="model"
              [ngbTypeahead]="findAnywhere"
              [inputFormatter]="uppercaseFormatter"
              [showHint]="true"/>`);
			const compiled = fixture.nativeElement;
			const inputEl = getNativeInput(compiled);
			await fixture.whenStable();

			changeInput(compiled, 'on');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one', 'one more']);
			expect(inputEl.value).toBe('onE');
			expect(inputEl.selectionStart).toBe(2);
			expect(inputEl.selectionEnd).toBe(3);

			const event = createKeyDownEvent('ArrowDown');
			getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
			await fixture.whenStable();
			expect(inputEl.value).toBe('onE MORE');
			expect(inputEl.selectionStart).toBe(2);
			expect(inputEl.selectionEnd).toBe(8);
		});

		it('should not show hint when there is no result selected', async () => {
			const fixture = await createTestComponent(
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" [showHint]="true" [focusFirst]="false"/>`,
			);
			await fixture.whenStable();
			const compiled = fixture.nativeElement;
			const inputEl = getNativeInput(compiled);
			await fixture.whenStable();

			changeInput(compiled, 'on');
			await fixture.whenStable();
			expectWindowResults(compiled, ['one', 'one more']);
			expect(inputEl.value).toBe('on');
		});

		describe('should clear input properly when model get reset to empty string', () => {
			[
				`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find" />`,
				`<input type="text" [(ngModel)]="model" [showHint]="true" [ngbTypeahead]="find" />`,
			].forEach((html, index) => {
				const showHint = index === 1;
				it(`${index === 0 ? 'without' : 'with'} showHint activated`, async () => {
					const fixture = await createTestComponent(html);
					await fixture.whenStable();

					const compiled = fixture.nativeElement;
					changeInput(compiled, 'on');
					await fixture.whenStable();

					expectInputValue(compiled, showHint ? 'one' : 'on');

					fixture.componentInstance.model.set('');
					await fixture.whenStable();
					await fixture.whenStable();

					document.body.click();
					await fixture.whenStable();

					expectInputValue(compiled, '');
				});
			});
		});
	});

	describe('Custom config', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [NgbTypeaheadConfig],
			});
			TestBed.overrideComponent(TestComponent, {
				set: { template: '<input type="text" [(ngModel)]="model" [ngbTypeahead]="findAnywhere"/>' },
			});
			const config = TestBed.inject(NgbTypeaheadConfig);
			config.showHint = true;
		});

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(TestComponent);

			const typeahead = fixture.componentInstance.typeahead;
			expect(typeahead.showHint).toBe(true);
		});
	});

	describe('Custom config as provider', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [NgbTypeaheadConfig],
			});
			TestBed.overrideComponent(TestComponent, {
				set: { template: '<input type="text" [(ngModel)]="model" [ngbTypeahead]="findAnywhere"/>' },
			});
			const config = TestBed.inject(NgbTypeaheadConfig);
			config.showHint = true;
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = TestBed.createComponent(TestComponent);
			const typeahead = fixture.componentInstance.typeahead;
			expect(typeahead.showHint).toBe(true);
		});
	});

	describe('selectOnExact set to true', () => {
		let fixture;
		let compiled;
		let inputEl;
		beforeEach(async () => {
			fixture = await createTestComponent(
				`<input type='text' [(ngModel)]='model' [ngbTypeahead]='findAnywhere' [selectOnExact]='true'/>`,
			);
			compiled = fixture.nativeElement;
			inputEl = getNativeInput(compiled);
		});

		it('should select the only existing result when it matches the user input', async () => {
			changeInput(compiled, 'one more');
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expect(inputEl.value).toBe('one more');
		});

		it('should not select the only existing result when it doesn`t match the user input', async () => {
			changeInput(compiled, 'one mor');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one more']);
			expect(inputEl.value).toBe('one mor');
		});
	});

	describe('selectOnExact set to true with objects', () => {
		let fixture;
		let compiled;
		let inputEl;
		beforeEach(async () => {
			fixture = await createTestComponent(`<input
					[(ngModel)]='model'
					[ngbTypeahead]='findObjectsFormatter'
					[selectOnExact]='true'
					[inputFormatter]='formatter'
					[resultFormatter]='formatter'/>`);
			compiled = fixture.nativeElement;
			inputEl = getNativeInput(compiled);
		});

		it('should select the only existing result when it matches the user input', async () => {
			changeInput(compiled, '10 one more');
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expect(inputEl.value).toBe('10 one more');
			expect(fixture.componentInstance.model()).toEqual({ id: 10, value: 'one more' });
		});

		it('should not select the only existing result when it doesn`t match the user input', async () => {
			changeInput(compiled, '10 one mor');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+10 one more']);
			expect(inputEl.value).toBe('10 one mor');
		});
	});

	describe('selectOnExact set to true and editable set to false', () => {
		let fixture;
		let compiled;
		let inputEl;
		beforeEach(async () => {
			fixture = await createTestComponent(`
				<form [formGroup]='form'>
					<input type='text' formControlName='control' [ngbTypeahead]='findAnywhere' [selectOnExact]='true' [editable]='false'/>
				</form>`);
			compiled = fixture.nativeElement;
			inputEl = getNativeInput(compiled);
		});

		it('should select the only existing result when it matches the user input', async () => {
			changeInput(compiled, 'one more');
			await fixture.whenStable();
			expect(getWindow(compiled)).toBeNull();
			expect(fixture.componentInstance.form.controls.control.value).toBe('one more');
			expect(fixture.componentInstance.form.controls.control.valid).toBe(true);
		});

		it('should not select the only existing result when it doesn`t match the user input', async () => {
			changeInput(compiled, 'one mor');
			await fixture.whenStable();
			expectWindowResults(compiled, ['+one more']);
			expect(fixture.componentInstance.form.controls.control.value).toBeNull();
			expect(fixture.componentInstance.form.controls.control.valid).toBe(false);
		});
	});
});

@Component({
	selector: 'typeahead-test-cmp',
	imports: [NgbHighlight, NgbTypeahead, FormsModule, ReactiveFormsModule],
	template: '',
})
class TestComponent {
	private _strings = ['one', 'one more', 'two', 'three'];
	private _objects = [
		{ id: 1, value: 'one' },
		{ id: 10, value: 'one more' },
		{ id: 2, value: 'two' },
		{ id: 3, value: 'three' },
	];

	readonly model = signal<any>(undefined);
	readonly selectEventValue = signal<any>(undefined);
	readonly show = signal(true);

	readonly form = new UntypedFormGroup({ control: new UntypedFormControl('', Validators.required) });

	findOutput$: Observable<any[]>;

	@ViewChild(NgbTypeahead, { static: true })
	typeahead: NgbTypeahead;
	readonly focus$ = new Subject<string>();
	readonly click$ = new Subject<string>();

	readonly findRef = signal<OperatorFunction<string, readonly any[]> | null | undefined>(null);

	find = (text$: Observable<string>) => {
		const clicks$ = this.click$.pipe(filter(() => !this.typeahead.isPopupOpen()));
		this.findOutput$ = merge(text$, this.focus$, clicks$).pipe(
			map((text) => this._strings.filter((v) => v.startsWith(text))),
		);
		return this.findOutput$;
	};

	findFilter = (text$: Observable<string>) => {
		return text$.pipe(
			filter((term) => term.length > 1),
			map((text) => this._strings.filter((v) => v.indexOf(text) > -1)),
		);
	};

	findAnywhere = (text$: Observable<string>) => {
		return text$.pipe(map((text) => this._strings.filter((v) => v.indexOf(text) > -1)));
	};

	findNothing = (text$: Observable<string>) => {
		return text$.pipe(map((text) => []));
	};

	findNull = (text$: Observable<string>) => {
		return text$.pipe(map((text) => null));
	};

	findObjects = (text$: Observable<string>) => {
		return text$.pipe(map((text) => this._objects.filter((v) => v.value.startsWith(text))));
	};

	findObjectsFormatter = (text$: Observable<string>) => {
		return text$.pipe(map((text) => this._objects.filter((v) => this.formatter(v).startsWith(text))));
	};

	formatter = (obj: { id: number; value: string }) => {
		return `${obj.id} ${obj.value}`;
	};

	uppercaseFormatter = (s) => `${s}`.toUpperCase();

	uppercaseObjFormatter = (obj: { value: string }) => {
		return `${obj.value}`.toUpperCase();
	};

	onSelect($event) {
		this.selectEventValue.set($event);
	}
}

@Component({
	selector: 'test-onpush-cmp',
	imports: [NgbHighlight, NgbTypeahead, FormsModule],
	template: '',
})
class TestOnPushComponent {
	private _strings = ['one', 'one more', 'two', 'three'];

	find = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(200),
			map((text) => this._strings.filter((v) => v.startsWith(text))),
		);
	};
}

@Component({
	selector: 'test-async-cmp',
	imports: [NgbHighlight, NgbTypeahead],
	template: '',
})
class TestAsyncComponent {
	private _strings = ['one', 'one more', 'two', 'three'];

	find = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(200),
			map((text) => this._strings.filter((v) => v.startsWith(text))),
		);
	};
}
