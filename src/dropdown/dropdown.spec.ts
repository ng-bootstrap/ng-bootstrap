import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createGenericTestComponent } from '../test/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
	NgbDropdown,
	NgbDropdownAnchor,
	NgbDropdownButtonItem,
	NgbDropdownConfig,
	NgbDropdownItem,
	NgbDropdownMenu,
	NgbDropdownToggle,
} from './dropdown.module';
import { Locator, page } from 'vitest/browser';
import { By } from '@angular/platform-browser';
import { Options } from '@popperjs/core';

class DropdownTester {
	readonly fixture: ComponentFixture<TestComponent>;
	readonly componentInstance: TestComponent;
	readonly root: Locator;
	readonly dropdown: Locator;
	readonly bodyDropdown: Locator;
	readonly menu: Locator;
	readonly toggle: Locator;

	constructor(fixtureOrHtml: ComponentFixture<TestComponent> | string) {
		this.fixture =
			fixtureOrHtml instanceof ComponentFixture
				? fixtureOrHtml
				: createGenericTestComponent(fixtureOrHtml, TestComponent, false);
		this.componentInstance = this.fixture.componentInstance;
		this.root = page.elementLocator(this.fixture.nativeElement);
		this.dropdown = page.getByCss('[ngbDropdown]');
		this.bodyDropdown = page.getByCss('.dropdown').last();
		this.menu = page.getByCss('[ngbDropdownMenu]');
		this.toggle = page.getByCss('[ngbDropdownToggle], [ngbDropdownAnchor]');
	}
}

expect.extend({
	toBeShown(actual: HTMLElement) {
		const { isNot } = this;
		const dropdownEl = actual.querySelector(`[ngbDropdown]`)!;
		const toggleEl = actual.querySelector(`[ngbDropdownToggle]`) ?? actual.querySelector(`[ngbDropdownAnchor]`)!;
		const menuEl = actual.querySelector(`[ngbDropdownMenu]`)!;
		if (isNot) {
			const isClosed =
				!dropdownEl.classList.contains('show') &&
				!toggleEl.classList.contains('show') &&
				!menuEl.classList.contains('show');

			return {
				pass: !isClosed,
				message: () =>
					`Expected ${actual.outerHTML} not to have the "show class on container, toggle and menu elements"`,
			};
		} else {
			const isOpen =
				dropdownEl.classList.contains('show') &&
				toggleEl.classList.contains('show') &&
				menuEl.classList.contains('show');

			return {
				pass: isOpen,
				message: () => `Expected ${actual.outerHTML} to have the "show class on container, toggle and menu elements"`,
			};
		}
	},
});

describe('ngb-dropdown', () => {
	it('should be closed and down by default', async () => {
		const html = `
      <div ngbDropdown>
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const tester = new DropdownTester(html);

		await expect.element(tester.root).not.toBeShown();
	});

	it('should have dropup CSS class if placed on top', async () => {
		const html = `
      <div ngbDropdown placement="top">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const tester = new DropdownTester(html);
		await expect.element(tester.dropdown).toBeVisible();

		await expect.element(tester.dropdown).toHaveClass('dropup');
	});

	it('should have dropdown CSS class if placement is other than top', async () => {
		const html = `
      <div ngbDropdown placement="bottom">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const tester = new DropdownTester(html);
		await expect.element(tester.dropdown).toBeVisible();
		await expect.element(tester.dropdown).toHaveClass('dropdown');
	});

	it('should allow setting a custom dropdown class', async () => {
		const html = `
      <div ngbDropdown placement="bottom" class="my-class" [dropdownClass]="dropdownClass()">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const tester = new DropdownTester(html);

		await expect.element(tester.dropdown).toHaveClass('custom-class', 'my-class', 'dropdown');

		tester.componentInstance.dropdownClass.set('');

		await expect.element(tester.dropdown).not.toHaveClass('custom-class');
		await expect.element(tester.dropdown).toHaveClass('my-class', 'dropdown');

		tester.componentInstance.dropdownClass.set('another-class');

		await expect.element(tester.dropdown).toHaveClass('another-class', 'my-class', 'dropdown');
	});

	it('should allow setting a custom dropdown class (container="body")', async () => {
		const html = `
      <div ngbDropdown placement="bottom" container="body" class="my-class" [dropdownClass]="dropdownClass()">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		// closed
		const tester = new DropdownTester(html);

		await expect.element(tester.toggle).toBeVisible();

		await expect.element(tester.bodyDropdown).not.toHaveClass('custom-class');
		await expect.element(tester.bodyDropdown).toHaveClass('my-class', 'dropdown');

		// open
		const dropdown = tester.fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);
		dropdown.open();

		await expect.element(tester.bodyDropdown).toHaveClass('custom-class dropdown');
		await expect.element(tester.bodyDropdown).not.toHaveCssClass('my-class');

		tester.componentInstance.dropdownClass.set('');

		await expect.element(tester.bodyDropdown).not.toHaveClass('custom-class');
		await expect.element(tester.bodyDropdown).not.toHaveClass('my-class');
		await expect.element(tester.bodyDropdown).toHaveClass('dropdown');

		tester.componentInstance.dropdownClass.set('another-class');

		await expect.element(tester.bodyDropdown).toHaveClass('another-class', 'dropdown');
		await expect.element(tester.bodyDropdown).not.toHaveClass('my-class');

		dropdown.close();
	});

	it('should be open initially if open expression is true', async () => {
		const html = `
      <div ngbDropdown [open]="true">
          <button ngbDropdownAnchor></button>
          <div ngbDropdownMenu>
            <a class="dropdown-item">dropDown item</a>
            <a class="dropdown-item">dropDown item</a>
          </div>
      </div>`;

		const tester = new DropdownTester(html);

		await expect.element(tester.root).toBeShown();
	});

	it('should toggle open on "open" binding change', async () => {
		const html = `
      <div ngbDropdown [open]="isOpen()">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

		const tester = new DropdownTester(html);

		await expect.element(tester.root).not.toBeShown();

		tester.componentInstance.isOpen.set(true);

		await expect.element(tester.root).toBeShown();

		tester.componentInstance.isOpen.set(false);

		await expect.element(tester.root).not.toBeShown();
	});

	it('should allow toggling dropdown from outside', async () => {
		const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown #drop="ngbDropdown">
        <button ngbDropdownAnchor></button>
        <div ngbDropdownMenu></div>
      </div>`;

		const tester = new DropdownTester(html);

		const openButton = page.getByRole('button', { name: 'Open' });
		const closeButton = page.getByRole('button', { name: 'Close' });
		const toggleButton = page.getByRole('button', { name: 'Toggle' });

		await openButton.click();
		await expect.element(tester.root).toBeShown();

		await closeButton.click();
		await expect.element(tester.root).not.toBeShown();

		await toggleButton.click();
		await expect.element(tester.root).toBeShown();

		await toggleButton.click();
		await expect.element(tester.root).not.toBeShown();
	});

	it('should allow binding to open output', async () => {
		const html = `
      <button (click)="drop.toggle(); $event.stopPropagation()">Toggle</button>
      <div ngbDropdown [(open)]="isOpen" #drop="ngbDropdown"></div>`;

		const tester = new DropdownTester(html);
		const toggleButton = page.getByRole('button', { name: 'Toggle' });

		expect(tester.componentInstance.isOpen()).toBe(false);

		await toggleButton.click();

		expect(tester.componentInstance.isOpen()).toBe(true);

		await toggleButton.click();

		expect(tester.componentInstance.isOpen()).toBe(false);
	});

	it('should not raise open events if open state does not change', async () => {
		const html = `
      <button (click)="drop.open(); $event.stopPropagation()">Open</button>
      <button (click)="drop.close(); $event.stopPropagation()">Close</button>
      <div ngbDropdown (openChange)="recordStateChange($event)" #drop="ngbDropdown" [autoClose]="false"></div>`;

		const tester = new DropdownTester(html);

		const openButton = page.getByRole('button', { name: 'Open' });
		const closeButton = page.getByRole('button', { name: 'Close' });

		expect(tester.componentInstance.isOpen()).toBe(false);
		expect(tester.componentInstance.stateChanges).toEqual([]);

		await closeButton.click(); // close a closed one

		expect(tester.componentInstance.isOpen()).toBe(false);
		expect(tester.componentInstance.stateChanges).toEqual([]);

		await openButton.click(); // open a closed one

		expect(tester.componentInstance.isOpen()).toBe(true);
		expect(tester.componentInstance.stateChanges).toEqual([true]);

		await openButton.click(); // open an opened one

		expect(tester.componentInstance.isOpen()).toBe(true);
		expect(tester.componentInstance.stateChanges).toEqual([true]);

		await closeButton.click(); // close an opened one

		expect(tester.componentInstance.isOpen()).toBe(false);
		expect(tester.componentInstance.stateChanges).toEqual([true, false]);
	});

	it('should disable a button dropdown item', async () => {
		const html = `<button ngbDropdownItem [disabled]="disabled()">dropDown item</button>`;

		const tester = new DropdownTester(html);
		const item = page.getByRole('button', { name: 'dropDown item' });

		await expect.element(item).not.toHaveClass('disabled');
		await expect.element(item).not.toBeDisabled();
		await expect.element(item).toHaveAttribute('tabindex', '0');

		tester.componentInstance.disabled.set(true);

		await expect.element(item).toHaveClass('disabled');
		await expect.element(item).toBeDisabled();
		await expect.element(item).toHaveAttribute('tabindex', '-1');
	});

	it('should allow using custom tabindex on a dropdown item', async () => {
		const html = `
			<button ngbDropdownItem>one</button>
			<button ngbDropdownItem disabled>two</button>
			<button ngbDropdownItem tabindex='3'>three</button>
			<button ngbDropdownItem tabindex='2' disabled>four</button>
		`;

		const tester = new DropdownTester(html);
		const [one, two, three, four] = ['one', 'two', 'three', 'four'].map((name) => page.getByRole('button', { name }));

		await expect.element(one).toHaveAttribute('tabindex', '0');
		await expect.element(two).toHaveAttribute('tabindex', '-1');
		await expect.element(three).toHaveAttribute('tabindex', '3');
		await expect.element(four).toHaveAttribute('tabindex', '-1');
	});

	it('should disable a link dropdown item', async () => {
		const html = `<a ngbDropdownItem [disabled]="disabled()" role="button">dropDown item</a>`;

		const tester = new DropdownTester(html);
		const item = page.getByRole('button', { name: 'dropDown item' });

		await expect.element(item).not.toHaveClass('disabled');
		await expect.element(item).toHaveAttribute('tabindex', '0');

		tester.componentInstance.disabled.set(true);

		await expect.element(item).toHaveClass('disabled');
		await expect.element(item).toHaveAttribute('tabindex', '-1');
	});

	it('should cleanup dropdown when parent container is destroyed', async () => {
		const html = `
			@if (show()) {
				<div ngbDropdown>
					<button ngbDropdownAnchor></button>
					<div ngbDropdownMenu>
						<a class="dropdown-item">dropdown item</a>
					</div>
				</div>
			}`;
		const tester = new DropdownTester(html);

		await expect.element(tester.dropdown).toBeVisible();
		const dropdown = tester.fixture.debugElement.query(By.directive(NgbDropdown)).injector.get(NgbDropdown);

		dropdown.open();

		await expect.element(tester.menu).toHaveClass('show');

		const opencloseSpy = vi.fn();

		dropdown.openChange.subscribe(opencloseSpy);

		tester.componentInstance.show.set(false);

		await expect.element(tester.dropdown).not.toBeInTheDocument();
		expect(opencloseSpy).toHaveBeenCalledWith(false);
	});

	describe('ngb-dropdown-toggle', () => {
		it('should toggle dropdown on click', async () => {
			const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>Toggle dropdown</button>
          <div ngbDropdownMenu></div>
      </div>`;

			const tester = new DropdownTester(html);

			await expect.element(tester.dropdown).not.toHaveClass('show');
			await expect.element(tester.toggle).not.toHaveClass('show');
			await expect.element(tester.toggle).toHaveAttribute('aria-expanded', 'false');

			await tester.toggle.click();

			await expect.element(tester.root).toBeShown();
			await expect.element(tester.toggle).toHaveAttribute('aria-expanded', 'true');

			await tester.toggle.click();

			await expect.element(tester.root).not.toBeShown();
			await expect.element(tester.toggle).toHaveAttribute('aria-expanded', 'false');
		});

		it('should toggle dropdown on click of child of toggle', async () => {
			const html = `
      <div ngbDropdown>
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

			const tester = new DropdownTester(html);
			const toggle = page.getByCss('.toggle');

			await expect.element(tester.root).not.toBeShown();

			await toggle.click();

			await expect.element(tester.root).toBeShown();

			await toggle.click();

			await expect.element(tester.root).not.toBeShown();
		});

		it('should be appended to body', async () => {
			const html = `
      <div ngbDropdown container="body">
          <button ngbDropdownToggle>
            <span class="toggle">Toggle dropdown</span>
          </button>
          <div ngbDropdownMenu></div>
      </div>`;

			const tester = new DropdownTester(html);

			await tester.toggle.click();

			await expect.element(tester.bodyDropdown).toHaveClass('dropdown');
			expect(tester.bodyDropdown.element().parentElement, 'The dropdown should be attached to the body').toBe(
				document.body,
			);
		});

		it(`should second placement if the first one doesn't fit`, async () => {
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

			const tester = new DropdownTester(html);
			await tester.toggle.click();

			await expect
				.poll(
					() =>
						Math.abs(
							tester.menu.element().getBoundingClientRect().left -
								tester.toggle.element().getBoundingClientRect().right,
						),
					{ message: 'Wrong dropdown placement' },
				)
				.toBeLessThan(3);
		});

		it('should modify the popper options', async () => {
			const html = `
			<div ngbDropdown placement="start-top end-top" [popperOptions]="popperOptions()">
					<button ngbDropdownToggle>
						<span class="toggle">Toggle dropdown</span>
					</button>
					<div ngbDropdownMenu>
						<a ngbDropdownItem>dropDown item</a>
						<a ngbDropdownItem>dropDown item</a>
				</div>
			</div>`;
			const tester = new DropdownTester(html);

			const spy = vi.fn();
			tester.componentInstance.popperOptions.set((options: Partial<Options>) => {
				options.modifiers!.push({ name: 'test', enabled: true, phase: 'main', fn: spy });
				return options;
			});
			await expect.element(tester.toggle).toBeVisible();
			await tester.toggle.click();

			expect(spy).toHaveBeenCalled();
		});
	});

	describe('ngb-dropdown-navbar', () => {
		it(`shouldn't position the menu`, async () => {
			const html = `
      <nav class="navbar">
        <div id="navbarNav">
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

			const tester = new DropdownTester(html);

			await tester.toggle.click();

			await expect
				.element(tester.menu, { message: `The dropdown element shouldn't have calculated styles` })
				.not.toHaveAttribute('style');
			await expect
				.element(tester.menu, { message: `The dropdown element shouldn't have data-popper-placement set` })
				.not.toHaveAttribute('data-popper-placement');
		});

		it(`shouldn't position the menu even if inside if block`, async () => {
			const html = `
      <nav class="navbar">
        <div id="navbarNav">
        	@if (true) {
						<ul class="navbar-nav">
							<li class="nav-item" ngbDropdown placement="bottom-right">
								<a class="nav-link" ngbDropdownToggle role="button">Open</a>
								<div ngbDropdownMenu>
									<div class="dropdown-item">Item</div>
								</div>
							</li>
						</ul>
					}
        </div>
      </nav>
    `;

			const tester = new DropdownTester(html);

			await tester.toggle.click();

			await expect
				.element(tester.menu, { message: `The dropdown element shouldn't have calculated styles` })
				.not.toHaveAttribute('style');
			await expect
				.element(tester.menu, { message: `The dropdown element shouldn't have data-popper-placement set` })
				.not.toHaveAttribute('data-popper-placement');
		});

		it(`can override the defaut display value`, async () => {
			const html = `
      <nav class="navbar">
        <div id="navbarNav">
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

			const tester = new DropdownTester(html);

			await tester.toggle.click();

			await expect
				.element(tester.menu, { message: `The dropdown element should have calculated styles` })
				.toHaveAttribute('style');
		});
	});
});

describe('Custom config', () => {
	let config: NgbDropdownConfig;

	beforeEach(() => {
		const html = `
			<div ngbDropdown>
          <div ngbDropdownMenu>
            <a ngbDropdownItem>dropDown item</a>
            <a ngbDropdownItem>dropDown item</a>
          </div>
      </div>`;
		TestBed.overrideTemplate(TestComponent, html);
		TestBed.configureTestingModule({
			providers: [NgbDropdownConfig],
		});
		config = TestBed.inject(NgbDropdownConfig);
		config.placement = 'top-right';
	});

	it('should initialize inputs with provided config', async () => {
		const tester = new DropdownTester(TestBed.createComponent(TestComponent));

		await expect.element(tester.dropdown).toHaveClass('dropup');
	});
});

describe('Custom config as provider', () => {
	it('should initialize inputs with provided config as provider', async () => {
		TestBed.overrideComponent(TestComponent, {
			set: {
				template: `
						<div ngbDropdown>
							<div ngbDropdownMenu>
								<a ngbDropdownItem>dropup item</a>
								<a ngbDropdownItem>dropup item</a>
							</div>
						</div>`,
			},
		});
		const config = TestBed.inject(NgbDropdownConfig);
		config.placement = 'top-right';
		const fixture = TestBed.createComponent(TestComponent);
		const tester = new DropdownTester(fixture);

		await expect.element(tester.dropdown).toHaveClass('dropup');
	});
});

@Component({
	selector: 'test-cmp',
	imports: [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu, NgbDropdownItem, NgbDropdownButtonItem],
	template: ``,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	isOpen = signal(false);
	stateChanges: boolean[] = [];
	dropdownClass = signal('custom-class');
	disabled = signal(false);
	show = signal(true);
	popperOptions = signal<(options: Partial<Options>) => Partial<Options>>((options) => options);

	recordStateChange($event) {
		this.stateChanges.push($event);
		this.isOpen.set($event);
	}
}
