import { expect } from 'vitest';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './test/test-styles.css';
import 'zone.js';
import 'zone.js/testing';
import '@angular/localize/init';

expect.extend({
	toHaveCssClass(actual: HTMLElement, className: string) {
		const { isNot } = this;
		return {
			pass: actual.classList.contains(className),
			message: () => `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`,
		};
	},
	toHaveModal(actual: HTMLElement, content?: string | string[], selector?: string) {
		const { isNot } = this;

		const allModalsContent = document.querySelector(selector || 'body')?.querySelectorAll('.modal-content') ?? [];
		let pass = true;
		let errMsg;

		if (!content) {
			pass = allModalsContent.length > 0;
			errMsg = 'at least one modal open but found none';
		} else if (Array.isArray(content)) {
			pass = allModalsContent.length === content.length;
			errMsg = `${content.length} modals open but found ${allModalsContent.length}`;
		} else {
			pass = allModalsContent.length === 1 && allModalsContent[0].textContent.trim() === content;
			errMsg = `exactly one modal open but found ${allModalsContent.length}`;
		}

		return {
			pass,
			message: () =>
				isNot
					? `Expected ${actual.outerHTML} not to have any modals open but found ${allModalsContent.length}`
					: `Expected ${actual.outerHTML} to have ${errMsg}`,
		};
	},
	toHaveBackdrop(actual: HTMLElement) {
		const { isNot } = this;
		const backdrop = document.querySelector('ngb-modal-backdrop');
		return {
			pass: !!backdrop,
			message: () => `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to have one backdrop element`,
		};
	},
	toHaveOffcanvas(actual: HTMLElement, content?: string, selector?: string) {
		const { isNot } = this;
		const offcanvasContent = document.querySelector(selector || 'body')?.querySelector('.offcanvas');
		let pass = true;
		let errMsg: string;

		if (!content) {
			pass = !!offcanvasContent;
			errMsg = 'offcanvas open but found none';
		} else {
			pass = !!offcanvasContent && offcanvasContent.textContent.trim() === content;
			errMsg = `offcanvas open with content ${content} but found none`;
		}

		return {
			pass,
			message: () =>
				isNot
					? `Expected ${actual.outerHTML} not to have an offcanvas open but found one`
					: `Expected ${actual.outerHTML} to have ${errMsg}`,
		};
	},
	toHaveOffcanvasBackdrop(actual: HTMLElement, selector?: string) {
		const { isNot } = this;
		const backdrop = document.querySelector(selector || 'body')?.querySelector('ngb-offcanvas-backdrop');
		return {
			pass: !!backdrop,
			message: () => `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to have one backdrop element`,
		};
	},
});
