import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { NgbModalWindow } from './modal-window';
import { inputBinding, signal } from '@angular/core';

describe('ngb-modal-dialog', () => {
	describe('basic rendering functionality', () => {
		it('should render default modal window', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow);
			await fixture.whenStable();

			const modalEl: Element = fixture.nativeElement;
			const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

			expect(modalEl).toHaveCssClass('modal');
			expect(dialogEl).toHaveCssClass('modal-dialog');
		});

		it('should render default modal window with a specified size', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow, {
				bindings: [inputBinding('size', () => 'sm')],
			});
			await fixture.whenStable();

			const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');
			expect(dialogEl).toHaveCssClass('modal-dialog');
			expect(dialogEl).toHaveCssClass('modal-sm');
		});

		it('should render default modal window with a specified fullscreen size', async () => {
			const fullscreen = signal<boolean | string | undefined>(undefined);
			const fixture = TestBed.createComponent(NgbModalWindow, {
				bindings: [inputBinding('fullscreen', fullscreen)],
			});
			await fixture.whenStable();

			const dialogEl = fixture.nativeElement.querySelector('.modal-dialog') as HTMLElement;
			expect(dialogEl).not.toHaveCssClass('modal-fullscreen');

			fullscreen.set(true);
			await fixture.whenStable();
			expect(dialogEl).toHaveCssClass('modal-fullscreen');

			fullscreen.set('sm');
			await fixture.whenStable();
			expect(dialogEl).toHaveCssClass('modal-fullscreen-sm-down');

			fullscreen.set('custom');
			await fixture.whenStable();
			expect(dialogEl).toHaveCssClass('modal-fullscreen-custom-down');
		});

		it('should render default modal window with a specified class', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow, {
				bindings: [inputBinding('windowClass', () => 'custom-class')],
			});
			await fixture.whenStable();

			expect(fixture.nativeElement).toHaveCssClass('custom-class');
		});

		it('aria attributes', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow);
			await fixture.whenStable();
			const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

			expect(fixture.nativeElement.getAttribute('role')).toBe('dialog');
			expect(dialogEl.getAttribute('role')).toBe('document');
		});

		it('should render default modal window with a specified role', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow, {
				bindings: [inputBinding('role', () => 'alertdialog')],
			});
			await fixture.whenStable();
			const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');

			expect(fixture.nativeElement.getAttribute('role')).toBe('alertdialog');
			expect(dialogEl.getAttribute('role')).toBe('document');
		});

		it('should render modal dialog with a specified class', async () => {
			const fixture = TestBed.createComponent(NgbModalWindow, {
				bindings: [inputBinding('modalDialogClass', () => 'custom-dialog-class')],
			});
			await fixture.whenStable();

			const dialogEl: Element = fixture.nativeElement.querySelector('.modal-dialog');
			expect(dialogEl).toHaveCssClass('modal-dialog');
			expect(dialogEl).toHaveCssClass('custom-dialog-class');
		});
	});
});
