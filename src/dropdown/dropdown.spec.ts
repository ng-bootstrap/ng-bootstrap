import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';
import createSpy = jasmine.createSpy;

import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { NgbDropdown, NgbDropdownModule } from './dropdown.module';
import { NgbDropdownConfig } from './dropdown-config';
import { By } from '@angular/platform-browser';
import { Options } from '@popperjs/core';

const createTestComponent = (html: string) =>
	createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getDropdownEl(tc) {
	return tc.querySelector(`[ngbDropdown]`);
}

function getMenuEl(tc) {
	return tc.querySelector(`[ngbDropdownMenu]`);
}

const jasmineMatchers: jasmine.CustomMatcherFactories = {
	toBeShown: function () {
		return {
			compare: function (actual) {
				const dropdownEl = getDropdownEl(actual);
				const menuEl = getMenuEl(actual);
				const isOpen = dropdownEl.classList.contains('show') && menuEl.classList.contains('show');

				return {
					pass: isOpen,
					message: `Expected ${actual.outerHTML} to have the "show class on both container and menu"`,
				};
			},
			negativeCompare: function (actual) {
				const dropdownEl = getDropdownEl(actual);
				const menuEl = getMenuEl(actual);
				const isClosed = !dropdownEl.classList.contains('show') && !menuEl.classList.contains('show');

				return {
					pass: isClosed,
					message: `Expected ${actual.outerHTML} not to have the "show class both container and menu"`,
				};
			},
		};
	},
};

describe('ngb-dropdown', () => {
	beforeEach(() => {
		jasmine.addMatchers(jasmineMatchers);
	});

	it('should be closed and down by default', () => {
		const html = `
      <div ngbDropdown>
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;

		expect(compiled).not.toBeShown();
	});

	it('should have dropup CSS class if placed on top', () => {
		const html = `
      <div ngbDropdown placement="top">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;

		expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
	});

	it('should have dropdown CSS class if placement is other than top', () => {
		const html = `
      <div ngbDropdown placement="bottom">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;

		expect(getDropdownEl(compiled)).toHaveCssClass('dropdown');
	});

	it('should allow setting a custom dropdown class', () => {
		const html = `
      <div ngbDropdown placement="bottom" class="my-class" [dropdownClass]="dropdownClass">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const fixture = createTestComponent(html);
		const dropdownEl = getDropdownEl(fixture.nativeElement);

		expect(dropdownEl).toHaveCssClass('custom-class');
		expect(dropdownEl).toHaveCssClass('my-class');
		expect(dropdownEl).toHaveCssClass('dropdown');

		fixture.componentInstance.dropdownClass = '';
		fixture.detectChanges();

		expect(dropdownEl).not.toHaveCssClass('custom-class');
		expect(dropdownEl).toHaveCssClass('my-class');
		expect(dropdownEl).toHaveCssClass('dropdown');

		fixture.componentInstance.dropdownClass = 'another-class';
		fixture.detectChanges();

		expect(dropdownEl).toHaveCssClass('another-class');
		expect(dropdownEl).toHaveCssClass('my-class');
		expect(dropdownEl).toHaveCssClass('dropdown');
	});

	it('should allow setting a custom dropdown class (container="body")', () => {
		const html = `
      <div ngbDropdown placement="bottom" container="body" class="my-class" [dropdownClass]="dropdownClass">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		// closed
		const fixture = createTestComponent(html);
		const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);

		function dropdownEl() {
			return document.querySelector('div[ngbDropdownMenu]')!.parentNode!;
		}

		expect(dropdownEl()).not.toHaveCssClass('custom-class');
		expect(dropdownEl()).toHaveCssClass('my-class');
		expect(dropdownEl()).toHaveCssClass('dropdown');

		// open
		dropdown.open();
		fixture.detectChanges();

		expect(dropdownEl()).toHaveCssClass('custom-class');
		expect(dropdownEl()).not.toHaveCssClass('my-class');
		expect(dropdownEl()).toHaveCssClass('dropdown');

		fixture.componentInstance.dropdownClass = '';
		fixture.detectChanges();

		expect(dropdownEl()).not.toHaveCssClass('custom-class');
		expect(dropdownEl()).not.toHaveCssClass('my-class');
		expect(dropdownEl()).toHaveCssClass('dropdown');

		fixture.componentInstance.dropdownClass = 'another-class';
		fixture.detectChanges();

		expect(dropdownEl()).toHaveCssClass('another-class');
		expect(dropdownEl()).not.toHaveCssClass('my-class');
		expect(dropdownEl()).toHaveCssClass('dropdown');

		dropdown.close();
	});

	it('should be open initially if open expression is true', () => {
		const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;

		expect(compiled).toBeShown();
	});

	it('should toggle open on "open" binding change', () => {
		const html = `
      <div ngbDropdown [open]="isOpen">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;

		expect(compiled).not.toBeShown();

		fixture.componentInstance.isOpen = true;
		fixture.detectChanges();
		expect(compiled).toBeShown();

		fixture.componentInstance.isOpen = false;
		fixture.detectChanges();
		expect(compiled).not.toBeShown();
	});

	it('should allow toggling dropdown from outside', () => {
		const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		let buttonEls = compiled.querySelectorAll('button');

		buttonEls[0].click();
		fixture.detectChanges();
		expect(compiled).toBeShown();

		buttonEls[1].click();
		fixture.detectChanges();
		expect(compiled).not.toBeShown();

		buttonEls[2].click();
		fixture.detectChanges();
		expect(compiled).toBeShown();

		buttonEls[2].click();
		fixture.detectChanges();
		expect(compiled).not.toBeShown();
	});

	it('should allow binding to open output', () => {
		const html = `
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown [(open)]="isOpen" #drop="ngbDropdown"></div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		let buttonEl = compiled.querySelector('button');

		expect(fixture.componentInstance.isOpen).toBe(false);

		buttonEl.click();
		fixture.detectChanges();

		expect(fixture.componentInstance.isOpen).toBe(true);

		buttonEl.click();
		fixture.detectChanges();

		expect(fixture.componentInstance.isOpen).toBe(false);
	});

	it('should not raise open events if open state does not change', () => {
		const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <div ngbDropdown (openChange)="recordStateChange($event)" #drop="ngbDropdown"></div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		let buttonEls = compiled.querySelectorAll('button');

		expect(fixture.componentInstance.isOpen).toBe(false);
		expect(fixture.componentInstance.stateChanges).toEqual([]);

		buttonEls[1].click(); // close a closed one
		fixture.detectChanges();
		expect(fixture.componentInstance.isOpen).toBe(false);
		expect(fixture.componentInstance.stateChanges).toEqual([]);

		buttonEls[0].click(); // open a closed one
		fixture.detectChanges();
		expect(fixture.componentInstance.isOpen).toBe(true);
		expect(fixture.componentInstance.stateChanges).toEqual([true]);

		buttonEls[0].click(); // open an opened one
		fixture.detectChanges();
		expect(fixture.componentInstance.isOpen).toBe(true);
		expect(fixture.componentInstance.stateChanges).toEqual([true]);

		buttonEls[1].click(); // close an opened one
		fixture.detectChanges();
		expect(fixture.componentInstance.isOpen).toBe(false);
		expect(fixture.componentInstance.stateChanges).toEqual([true, false]);
	});

	it('should disable a button dropdown item', () => {
		const html = `<button ngbDropdownItem [disabled]="disabled">dropDown item</button>`;

		const fixture = createTestComponent(html);
		const itemEl = fixture.nativeElement.querySelector('button');

		expect(itemEl).not.toHaveCssClass('disabled');
		expect(itemEl.disabled).toBeFalse();
		expect(itemEl.tabIndex).toBe(0);

		fixture.componentInstance.disabled = true;
		fixture.detectChanges();

		expect(itemEl).toHaveCssClass('disabled');
		expect(itemEl.disabled).toBeTrue();
		expect(itemEl.tabIndex).toBe(-1);
	});

	it('should disable a link dropdown item', () => {
		const html = `<a ngbDropdownItem [disabled]="disabled">dropDown item</a>`;

		const fixture = createTestComponent(html);
		const itemEl = fixture.nativeElement.querySelector('a');

		expect(itemEl).not.toHaveCssClass('disabled');
		expect(itemEl.tabIndex).toBe(0);

		fixture.componentInstance.disabled = true;
		fixture.detectChanges();

		expect(itemEl).toHaveCssClass('disabled');
		expect(itemEl.tabIndex).toBe(-1);
	});

	it('should cleanup dropdown when parent container is destroyed', () => {
		const fixture = createTestComponent(`
          <ng-template [ngIf]="show">
            <div ngbDropdown>
              <button ngbDropdownAnchor></button>
              <div ngbDropdownMenu>
                <a class="dropdown-item">dropdown item</a>
              </div>
            </div>
          </ng-template>`);
		const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
		const menuEl = getMenuEl(fixture.nativeElement);

		dropdown.open();
		fixture.detectChanges();
		expect(menuEl).toHaveCssClass('show');

		const opencloseSpy = createSpy();
		dropdown.openChange.subscribe(opencloseSpy);

		fixture.componentInstance.show = false;
		fixture.detectChanges();
		expect(getDropdownEl(fixture.nativeElement)).toBeNull();
		expect(opencloseSpy).toHaveBeenCalledWith(false);
	});
});

describe('ngb-dropdown-toggle', () => {
	beforeEach(() => {
		jasmine.addMatchers(jasmineMatchers);
	});

	it('should toggle dropdown on click', () => {
		const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu></div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		let dropdownEl = getDropdownEl(compiled);
		let buttonEl = compiled.querySelector('button');

		expect(dropdownEl).not.toHaveCssClass('show');
		expect(buttonEl.getAttribute('aria-expanded')).toBe('false');

		buttonEl.click();
		fixture.detectChanges();
		expect(compiled).toBeShown();
		expect(buttonEl.getAttribute('aria-expanded')).toBe('true');

		buttonEl.click();
		fixture.detectChanges();
		expect(compiled).not.toBeShown();
		expect(buttonEl.getAttribute('aria-expanded')).toBe('false');
	});

	it('should toggle dropdown on click of child of toggle', () => {
		const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		const toggleEl = compiled.querySelector('.toggle');

		expect(compiled).not.toBeShown();

		toggleEl.click();
		fixture.detectChanges();
		expect(compiled).toBeShown();

		toggleEl.click();
		fixture.detectChanges();
		expect(compiled).not.toBeShown();
	});

	it('should be appended to body', () => {
		const html = `
      <div ngbDropdown container="body">
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

		const fixture = createTestComponent(html);
		const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
		dropdown.open();
		fixture.detectChanges();
		const dropdownElement = document.querySelector('div[ngbDropdownMenu]')!;
		const parentContainer = dropdownElement.parentNode!;
		expect(parentContainer).toHaveCssClass('dropdown');
		expect(parentContainer.parentNode).toBe(document.body, 'The dropdown should be attached to the body');
	});

	it(`should second placement if the first one doesn't fit`, fakeAsync(() => {
		const html = `
      <div ngbDropdown placement="start-top end-top">
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropDown item</a>
            <a ngbDropdownItem>dropDown item</a>
        </div>
      </div>`;

		const fixture = createTestComponent(html);
		const compiled = fixture.nativeElement;
		const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
		dropdown.open();
		fixture.detectChanges();
		tick();
		const dropdownEl = compiled.querySelector('[ngbdropdownmenu]');
		const targetElement = compiled.querySelector('button');
		expect(
			Math.abs(dropdownEl.getBoundingClientRect().left - targetElement.getBoundingClientRect().right),
		).toBeLessThan(3, 'Wrong dropdown placement');
	}));

	it('should modify the popper options', (done) => {
		const fixture = createTestComponent(`
    <div ngbDropdown placement="start-top end-top">
        <button ngbDropdownToggle>
          <span class="toggle">Toggle dropdown</span>
        </button>
        <div ngbDropdownMenu>
          <a ngbDropdownItem>dropDown item</a>
          <a ngbDropdownItem>dropDown item</a>
      </div>
    </div>`);
		const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);

		const spy = createSpy();
		dropdown.popperOptions = (options: Partial<Options>) => {
			options.modifiers!.push({ name: 'test', enabled: true, phase: 'main', fn: spy });
			return options;
		};
		dropdown.open();

		queueMicrotask(() => {
			expect(spy).toHaveBeenCalledTimes(1);
			done();
		});
	});

	describe('ngb-dropdown-navbar', () => {
		it(`shouldn't position the menu`, () => {
			const html = `
      <nav class="navbar">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" ngbDropdown placement="bottom-right">
              <a class="nav-link" ngbDropdownToggle role="button">Open</a>
              <div ngbDropdownMenu>
                <div class="dropdown-item">Item</div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    `;

			const fixture = createTestComponent(html);
			const compiled = fixture.nativeElement;
			const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
			dropdown.open();
			fixture.detectChanges();
			const dropdownEl: HTMLElement = compiled.querySelector('[ngbdropdownmenu]');

			expect(dropdownEl.getAttribute('style')).toBeNull(`The dropdown element shouldn't have calculated styles`);
			expect(dropdownEl.getAttribute('data-popper-placement')).toBeNull(
				`The dropdown element shouldn't have data-popper-placement set`,
			);
		});

		it(`can override the defaut display value`, () => {
			const html = `
      <nav class="navbar">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item" ngbDropdown placement="bottom-right" display="dynamic">
              <a class="nav-link" ngbDropdownToggle role="button">Open</a>
              <div ngbDropdownMenu>
                <div class="dropdown-item">Item</div>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    `;

			const fixture = createTestComponent(html);
			const compiled = fixture.nativeElement;
			const dropdown = fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
			dropdown.open();
			fixture.detectChanges();
			const dropdownEl: HTMLElement = compiled.querySelector('[ngbdropdownmenu]');

			expect(dropdownEl.getAttribute('style')).not.toBeNull(`The dropdown element should have calculated styles`);
		});
	});

	describe('Custom config', () => {
		let config: NgbDropdownConfig;

		beforeEach(() => {
			TestBed.overrideComponent(TestComponent, {
				set: {
					template: `
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropDown item</a>
            <a ngbDropdownItem>dropDown item</a>
          </div>
      </div>`,
				},
			});
		});

		beforeEach(inject([NgbDropdownConfig], (c: NgbDropdownConfig) => {
			config = c;
			config.placement = 'top-right';
		}));

		it('should initialize inputs with provided config', () => {
			const fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();

			const compiled = fixture.nativeElement;

			expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
		});
	});

	describe('Custom config as provider', () => {
		let config = new NgbDropdownConfig();
		config.placement = 'top-right';

		beforeEach(() => {
			TestBed.configureTestingModule({
				providers: [{ provide: NgbDropdownConfig, useValue: config }],
			});
		});

		it('should initialize inputs with provided config as provider', () => {
			const fixture = createTestComponent(`
      <div ngbDropdown>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropup item</a>
            <a ngbDropdownItem>dropup item</a>
          </div>
      </div>`);
			fixture.detectChanges();

			const compiled = fixture.nativeElement;

			expect(getDropdownEl(compiled)).toHaveCssClass('dropup');
		});
	});
});

@Component({ selector: 'test-cmp', standalone: true, imports: [NgbDropdownModule, NgIf], template: '' })
class TestComponent {
	isOpen = false;
	stateChanges: boolean[] = [];
	dropdownClass = 'custom-class';
	disabled = false;
	show = true;

	recordStateChange($event) {
		this.stateChanges.push($event);
		this.isOpen = $event;
	}
}
