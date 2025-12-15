import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
	NgbNav,
	NgbNavConfig,
	NgbNavContent,
	NgbNavItem,
	NgbNavItemRole,
	NgbNavLink,
	NgbNavLinkBase,
	NgbNavLinkButton,
	NgbNavOutlet,
	NgbNavPane,
} from './nav.module';
import { createGenericTestComponent, isBrowserVisible } from '../test/common';
import { isDefined } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { NgbConfigAnimation } from '../test/ngb-config-animation';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';
import { environment } from '../utils/transition/ngbTransition';
import { Locator, page, server, userEvent } from 'vitest/browser';

class NavTester {
	readonly fixture: ComponentFixture<TestComponent>;
	readonly root: Locator;
	readonly componentInstance: TestComponent;
	readonly navDirective: NgbNav;

	constructor(html: string) {
		this.fixture = createGenericTestComponent(html, TestComponent, false);
		this.root = page.elementLocator(this.fixture.nativeElement);
		this.componentInstance = this.fixture.componentInstance;
		this.navDirective = this.fixture.debugElement.query(By.directive(NgbNav)).injector.get(NgbNav);
	}

	readonly nav = page.getByCss('[ngbNav]');
	readonly items = page.getByCss('[ngbNavItem]');
	readonly links = page.getByCss('[ngbNavLink]');
	readonly outlet = page.getByCss('.tab-content');
	readonly contents = this.outlet.getByCss('*');
}

async function expectLinks(tester: NavTester, expected: boolean[], shouldHaveNavItemClass = false) {
	await expect
		.element(tester.links, { message: `expected to find ${expected.length} links` })
		.toHaveLength(expected.length);

	for (let i = 0; i < expected.length; i++) {
		const link = tester.links.nth(i);
		await expect.element(link).toHaveClass('nav-link');
		if (expected[i]) {
			await expect.element(link).toHaveClass('active');
		} else {
			await expect.element(link).not.toHaveClass('active');
		}

		if (shouldHaveNavItemClass) {
			await expect.element(link).toHaveClass('nav-item');
		} else {
			await expect.element(link).not.toHaveClass('nav-item');
		}
	}
}

async function expectContents(tester: NavTester, expected: string[], activeIndex = 0) {
	await expect
		.element(tester.contents, { message: `expected to find ${expected.length} contents` })
		.toHaveLength(expected.length);

	for (let i = 0; i < expected.length; i++) {
		await expect.element(tester.contents.nth(i)).toHaveTextContent(expected[i]);
		if (i === activeIndex) {
			await expect.element(tester.contents.nth(i)).toHaveClass('active');
		} else {
			await expect.element(tester.contents.nth(i)).not.toHaveClass('active');
		}
	}
}

describe('nav', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({});
	});

	it('should initialize inputs with default values', () => {
		const tester = new NavTester('<ul ngbNav></ul>');
		let config = TestBed.inject(NgbNavConfig);

		expect(tester.navDirective.destroyOnHide).toBe(config.destroyOnHide);
		expect(tester.navDirective.roles).toBe(config.roles);
		expect(tester.navDirective.orientation).toBe(config.orientation);
		expect(tester.navDirective.keyboard).toBe(config.keyboard);
	});

	it(`should set and allow overriding CSS classes`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [class]="'nav-tabs my-nav'">
        <li ngbNavItem [class]="'my-nav-item'">
            <button ngbNavLink [class]="'my-nav-link'"></button>
            <ng-template ngbTabContent></ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n" [class]="'my-tab-content'"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.nav).toHaveClass('nav', 'my-nav');
		await expect.element(tester.items.nth(0)).toHaveClass('nav-item', 'my-nav-item');
		await expect.element(tester.links.nth(0)).toHaveClass('nav-link', 'my-nav-link');
		await expect.element(tester.outlet).toHaveClass('tab-content', 'my-tab-content');
		await expect.element(tester.contents).toHaveClass('tab-pane');
	});

	it(`should set correct A11Y roles`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink></button>
            <ng-template ngbTabContent></ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.nav).toHaveRole('tablist');
		await expect.element(tester.items.nth(0)).toHaveRole('presentation');
		await expect.element(tester.links.nth(0)).toHaveRole('tab');
		await expect.element(tester.contents).toHaveRole('tabpanel');
	});

	it(`should not set any A11Y roles if [roles]='false'`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [roles]="false" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink></button>
            <ng-template ngbTabContent></ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.nav).not.toHaveAttribute('role');
		await expect.element(tester.items.nth(0)).not.toHaveAttribute('role');
		await expect.element(tester.links.nth(0)).not.toHaveAttribute('role');
		await expect.element(tester.contents).not.toHaveAttribute('role');
	});

	it(`should allow overriding any A11Y roles`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" role="list" class="nav-tabs">
        <li ngbNavItem role="myItemRole">
            <button ngbNavLink role="myLinkRole"></button>
            <ng-template ngbTabContent></ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n" paneRole="myPaneRole"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.nav).toHaveAttribute('role', 'list');
		await expect.element(tester.items.nth(0)).toHaveAttribute('role', 'myItemRole');
		await expect.element(tester.links.nth(0)).toHaveAttribute('role', 'myLinkRole');
		await expect.element(tester.contents).toHaveAttribute('role', 'myPaneRole');
	});

	it(`should set orientation CSS and 'aria-orientation' correctly`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [orientation]="orientation()" [roles]="roles()">
        <li ngbNavItem>
            <button ngbNavLink></button>
            <ng-template ngbTabContent></ng-template>
        </li>
      </ul>
    `;
		const tester = new NavTester(html);

		// horizontal + 'tablist'
		await expect.element(tester.nav).not.toHaveClass('flex-column');
		await expect.element(tester.nav).not.toHaveAttribute('aria-orientation');

		// vertical + 'tablist'
		tester.componentInstance.orientation.set('vertical');

		await expect.element(tester.nav).toHaveClass('flex-column');
		await expect.element(tester.nav).toHaveAttribute('aria-orientation', 'vertical');

		// vertical + no 'tablist'
		tester.componentInstance.roles.set(false);

		await expect.element(tester.nav).toHaveClass('flex-column');
		await expect.element(tester.nav).not.toHaveAttribute('aria-orientation');

		// horizontal + no 'tablist'
		tester.componentInstance.orientation.set('horizontal');

		await expect.element(tester.nav).not.toHaveClass('flex-column');
		await expect.element(tester.nav).not.toHaveAttribute('aria-orientation');
	});

	it(`should initially select first tab, if no [activeId] provided`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs" (activeIdChange)="onActiveIdChange($event)" (navChange)="onNavChange($event)">
        <li [ngbNavItem]="1">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li [ngbNavItem]="2">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		const navChangeSpy = vi.spyOn(tester.componentInstance, 'onNavChange');
		const activeIdChangeSpy = vi.spyOn(tester.componentInstance, 'onActiveIdChange');

		await expect.element(tester.nav).toBeVisible();

		await expectLinks(tester, [true, false]);
		await expectContents(tester, ['content 1']);
		expect(activeIdChangeSpy).toHaveBeenCalledWith(1);
		expect(navChangeSpy).toHaveBeenCalledTimes(0);
	});

	it(`should initially select nothing, if [activeId] provided is incorrect`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [activeId]="100" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [false]);
		await expect.element(tester.contents).not.toBeInTheDocument();
	});

	it(`should work without any items provided`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.links).toHaveLength(0);
		await expect.element(tester.contents).not.toBeInTheDocument();
	});

	it(`should work without nav content provided`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
        </li>
        <li ngbNavItem domId="two">
            <button ngbNavLink>link 2</button>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false]);
		await expectContents(tester, ['']);

		await tester.links.nth(1).click();

		await expectLinks(tester, [false, true]);
		await expectContents(tester, ['']);
	});

	it(`should work without 'ngbNavOutlet'`, async () => {
		const html = `
      <ul ngbNav class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
        </li>
        <li ngbNavItem domId="two">
            <button ngbNavLink>link 2</button>
        </li>
      </ul>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false]);

		await tester.links.nth(1).click();

		await expectLinks(tester, [false, true]);
	});

	it(`should work with dynamically generated navs`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [(activeId)]="activeId" class="nav-tabs">
      	@for (item of items(); track item) {
					<li [ngbNavItem]="item">
							<button ngbNavLink>link {{ item }}</button>
							<ng-template ngbNavContent>content {{ item }}</ng-template>
					</li>
        }
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		// 2 navs
		await expectLinks(tester, [true, false]);
		await expectContents(tester, ['content 1']);
		expect(tester.componentInstance.activeId()).toBe(1);

		// 1 nav
		tester.componentInstance.items.update((items) => items.slice(1));

		await expectLinks(tester, [false]);
		await expect(tester.contents).not.toBeInTheDocument();
		expect(tester.componentInstance.activeId()).toBe(1);

		// adjust activeId
		tester.componentInstance.activeId.set(2);

		await expectLinks(tester, [true]);
		await expectContents(tester, ['content 2']);

		// no navs
		tester.componentInstance.items.update((items) => items.slice(1));

		await expect.element(tester.links).toHaveLength(0);
		await expect.element(tester.contents).not.toBeInTheDocument();
		expect(tester.componentInstance.activeId()).toBe(2);
	});

	it(`should work with conditional nav items`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [(activeId)]="activeId" class="nav-tabs">
      	@if (visible()) {
					<li [ngbNavItem]="1">
							<button ngbNavLink>link 1</button>
							<ng-template ngbNavContent>content 1</ng-template>
					</li>
					<li [ngbNavItem]="2">
							<button ngbNavLink>link 2</button>
							<ng-template ngbNavContent>content 2</ng-template>
					</li>
        }
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		tester.componentInstance.activeId.set(2);

		expect(tester.componentInstance.visible()).toBe(false);
		await expectLinks(tester, []);
		await expectContents(tester, []);

		tester.componentInstance.visible.set(true);

		await expectLinks(tester, [false, true]);
		await expectContents(tester, ['content 2']);
	});

	it(`should change navs with [activeId] binding`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [activeId]="activeId()" class="nav-tabs">
        <li [ngbNavItem]="1">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li [ngbNavItem]="2">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false]);
		await expectContents(tester, ['content 1']);

		tester.componentInstance.activeId.set(2);

		await expectLinks(tester, [false, true]);
		await expectContents(tester, ['content 2']);
	});

	it(`should work navs with boundary [ngbNavItem] values`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [activeId]="activeId()" class="nav-tabs">
        <li [ngbNavItem]="0">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li [ngbNavItem]="true">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
        <li [ngbNavItem]="false">
            <button ngbNavLink>link 3</button>
            <ng-template ngbNavContent>content 3</ng-template>
        </li>
        <li [ngbNavItem]="''">
            <button ngbNavLink>link 4</button>
            <ng-template ngbNavContent>content 4</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false, false, false]);
		await expectContents(tester, ['content 1']);

		tester.componentInstance.activeId.set(true);

		await expectLinks(tester, [false, true, false, false]);
		await expectContents(tester, ['content 2']);

		tester.componentInstance.activeId.set(false);

		await expectLinks(tester, [false, false, true, false]);
		await expectContents(tester, ['content 3']);

		tester.componentInstance.activeId.set(0);

		await expectLinks(tester, [true, false, false, false]);
		await expectContents(tester, ['content 1']);

		tester.componentInstance.activeId.set('');

		await expectLinks(tester, [false, false, false, false]);
		await expectContents(tester, []);
	});

	it(`should allow overriding ids used in DOM with [domId]`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem domId="one">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem domId="two">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.links.nth(0)).toHaveAttribute('id', 'one');
		await expect.element(tester.links.nth(1)).toHaveAttribute('id', 'two');
		await expect.element(tester.contents).toHaveAttribute('id', 'one-panel');
	});

	it(`should fallback to [domId] if [ngbNavItem] is not set`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem domId="two">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false]);
		await expectContents(tester, ['content 1']);

		tester.navDirective.select('two');

		await expectLinks(tester, [false, true]);
		await expectContents(tester, ['content 2']);
	});

	describe(`change with`, () => {
		let tester: NavTester;
		let navChangeSpy: Mock;
		let activeIdChangeSpy: Mock;
		let hiddenNavSpy: Mock;
		let shownNavSpy: Mock;
		let hiddenItemSpy: Mock;
		let shownItemSpy: Mock;

		beforeEach(async () => {
			const html = `
        <ul ngbNav #n="ngbNav" class="nav-tabs" [(activeId)]="activeId" (activeIdChange)="onActiveIdChange($event)"
        (shown)="onNavShown($event)" (hidden)="onNavHidden($event)" (navChange)="onNavChange($event)">
          <li [ngbNavItem]="1" (hidden)="onItemHidden(1)" (shown)="onItemShown(1)">
              <a ngbNavLink>link 1</a>
              <ng-template ngbNavContent>content 1</ng-template>
          </li>
          <li [ngbNavItem]="2" (hidden)="onItemHidden(2)" (shown)="onItemShown(2)">
              <button ngbNavLink>link 2</button>
              <ng-template ngbNavContent>content 2</ng-template>
          </li>
          <li [ngbNavItem]="3" [disabled]="true" (hidden)="onItemHidden(3)" (shown)="onItemShown(3)">
              <button ngbNavLink>disabled</button>
              <ng-template ngbNavContent>content 3</ng-template>
          </li>
					<li [ngbNavItem]="4" [disabled]="true" (hidden)="onItemHidden(4)" (shown)="onItemShown(4)">
              <a ngbNavLink>disabled</a>
              <ng-template ngbNavContent>content 4</ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="n"></div>
      `;
			tester = new NavTester(html);

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);

			navChangeSpy = vi.spyOn(tester.componentInstance, 'onNavChange');
			activeIdChangeSpy = vi.spyOn(tester.componentInstance, 'onActiveIdChange');
			hiddenItemSpy = vi.spyOn(tester.componentInstance, 'onItemHidden');
			shownItemSpy = vi.spyOn(tester.componentInstance, 'onItemShown');
			hiddenNavSpy = vi.spyOn(tester.componentInstance, 'onNavHidden');
			shownNavSpy = vi.spyOn(tester.componentInstance, 'onNavShown');
		});

		it(`(click) should change navs`, async () => {
			await tester.links.nth(1).click();

			await expectLinks(tester, [false, true, false, false]);
			await expectContents(tester, ['content 2']);
			expect(tester.componentInstance.activeId()).toBe(2);
			expect(activeIdChangeSpy).toHaveBeenCalledWith(2);
			expect(navChangeSpy).toHaveBeenCalledWith({ activeId: 1, nextId: 2, preventDefault: expect.any(Function) });
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).toHaveBeenCalledWith(2);
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).toHaveBeenCalledWith(2);
		});

		it(`(click) on the same nav should do nothing`, async () => {
			await tester.links.nth(0).click();

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).not.toHaveBeenCalled();
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).not.toHaveBeenCalled();
			expect(shownNavSpy).not.toHaveBeenCalled();
		});

		it(`(click) should not change to a disabled nav`, async () => {
			// click without going through the locator click, because the button is disabled
			(tester.links.nth(2).element() as HTMLElement).click();

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).not.toHaveBeenCalled();
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).not.toHaveBeenCalled();
			expect(shownNavSpy).not.toHaveBeenCalled();

			// click without going through the locator click, because the button is disabled
			(tester.links.nth(3).element() as HTMLElement).click();

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).not.toHaveBeenCalled();
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).not.toHaveBeenCalled();
			expect(shownNavSpy).not.toHaveBeenCalled();
		});

		it(`[activeId] should change navs`, async () => {
			tester.componentInstance.activeId.set(2);

			await expectLinks(tester, [false, true, false, false]);
			await expectContents(tester, ['content 2']);
			expect(tester.componentInstance.activeId()).toBe(2);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).toHaveBeenCalledWith(2);
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).toHaveBeenCalledWith(2);
		});

		it(`[activeId] on the same nav should do nothing`, async () => {
			tester.componentInstance.activeId.set(1);

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).not.toHaveBeenCalled();
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).not.toHaveBeenCalled();
			expect(shownNavSpy).not.toHaveBeenCalled();
		});

		it(`[activeId] should change to a disabled nav`, async () => {
			tester.componentInstance.activeId.set(3);

			await expectLinks(tester, [false, false, true, false]);
			await expectContents(tester, ['content 3']);
			expect(tester.componentInstance.activeId()).toBe(3);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).toHaveBeenCalledWith(3);
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).toHaveBeenCalledWith(3);
		});

		it(`[activeId] should change to an invalid nav`, async () => {
			tester.componentInstance.activeId.set(1000);

			await expectLinks(tester, [false, false, false, false]);
			await expect(tester.contents).not.toBeInTheDocument();
			expect(tester.componentInstance.activeId()).toBe(1000);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).not.toHaveBeenCalled();
		});

		it(`'.select()' should change navs`, async () => {
			tester.navDirective.select(2);

			await expectLinks(tester, [false, true, false, false]);
			await expectContents(tester, ['content 2']);
			expect(tester.componentInstance.activeId()).toBe(2);
			expect(activeIdChangeSpy).toHaveBeenCalledWith(2);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).toHaveBeenCalledWith(2);
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).toHaveBeenCalledWith(2);
		});

		it(`'.select()' on the same nav should do nothing`, async () => {
			tester.navDirective.select(1);

			await expectLinks(tester, [true, false, false, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).not.toHaveBeenCalled();
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).not.toHaveBeenCalled();
			expect(shownNavSpy).not.toHaveBeenCalled();
		});

		it(`'.select()' should change to a disabled nav`, async () => {
			tester.navDirective.select(3);

			await expectLinks(tester, [false, false, true, false]);
			await expectContents(tester, ['content 3']);
			expect(tester.componentInstance.activeId()).toBe(3);
			expect(activeIdChangeSpy).toHaveBeenCalledWith(3);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).toHaveBeenCalledWith(3);
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).toHaveBeenCalledWith(3);

			tester.navDirective.select(4);

			await expectLinks(tester, [false, false, false, true]);
			await expectContents(tester, ['content 4']);
			expect(tester.componentInstance.activeId()).toBe(4);
			expect(activeIdChangeSpy).toHaveBeenCalledWith(4);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(3);
			expect(shownItemSpy).toHaveBeenCalledWith(4);
			expect(hiddenNavSpy).toHaveBeenCalledWith(3);
			expect(shownNavSpy).toHaveBeenCalledWith(4);
		});

		it(`'.select()' should change to an invalid nav`, async () => {
			tester.navDirective.select(1000);

			await expectLinks(tester, [false, false, false, false]);
			await expect.element(tester.contents).not.toBeInTheDocument();
			expect(tester.componentInstance.activeId()).toBe(1000);
			expect(activeIdChangeSpy).toHaveBeenCalledWith(1000);
			expect(navChangeSpy).toHaveBeenCalledTimes(0);
			expect(hiddenItemSpy).toHaveBeenCalledWith(1);
			expect(shownItemSpy).not.toHaveBeenCalled();
			expect(hiddenNavSpy).toHaveBeenCalledWith(1);
			expect(shownNavSpy).not.toHaveBeenCalled();
		});
	});

	it(`should not change container scroll position after switching navs`, async () => {
		const html = `
        <div class="container" style="overflow: scroll; height: 5rem; border: 1px solid gray; padding-top: 2rem;">
          <ul ngbNav #n="ngbNav" class="nav-tabs">
            <li ngbNavItem>
                <button ngbNavLink>link 1</button>
                <ng-template ngbNavContent>content 1</ng-template>
            </li>
            <li ngbNavItem>
                <button ngbNavLink>link 2</button>
                <ng-template ngbNavContent>content 2</ng-template>
            </li>
          </ul>
          <div [ngbNavOutlet]="n"></div>
        </div>
      `;
		const tester = new NavTester(html);
		await expect.element(tester.nav).toBeVisible();

		const container = page.getByCss('.container').element() as HTMLElement;

		// scroll to bottom
		container.scrollTop = container.scrollHeight;
		const { scrollTop } = container;
		expect(container.scrollTop).toBe(scrollTop);

		// staying at the same position after changing the nav
		await tester.links.nth(1).click();

		expect(container.scrollTop).toBe(scrollTop);
	});

	describe(`(navChange) preventDefault()`, () => {
		let navChangeSpy: Mock;
		let activeIdChangeSpy: Mock;
		let tester: NavTester;

		beforeEach(async () => {
			const html = `
        <ul ngbNav #n="ngbNav" class="nav-tabs" [(activeId)]="activeId" (activeIdChange)="onActiveIdChange($event)"
        (navChange)="onNavChangePrevent($event)">
          <li [ngbNavItem]="1">
              <button ngbNavLink>link 1</button>
              <ng-template ngbNavContent>content 1</ng-template>
          </li>
          <li [ngbNavItem]="2">
              <button ngbNavLink>link 2</button>
              <ng-template ngbNavContent>content 2</ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="n"></div>
      `;
			tester = new NavTester(html);

			await expectLinks(tester, [true, false]);
			await expectContents(tester, ['content 1']);

			navChangeSpy = vi.spyOn(tester.componentInstance, 'onNavChangePrevent');
			activeIdChangeSpy = vi.spyOn(tester.componentInstance, 'onActiveIdChange');
		});

		it(`on (click) should not change navs`, async () => {
			await tester.links.nth(1).click();

			await expectLinks(tester, [true, false]);
			await expectContents(tester, ['content 1']);
			expect(tester.componentInstance.activeId()).toBe(1);
			expect(activeIdChangeSpy).toHaveBeenCalledTimes(0);
			expect(navChangeSpy).toHaveBeenCalledWith({ activeId: 1, nextId: 2, preventDefault: expect.any(Function) });
		});
	});

	it(`should work with two-way [(activeId)] binding`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [(activeId)]="activeId" (activeIdChange)="onActiveIdChange($event)" class="nav-tabs">
        <li [ngbNavItem]="1">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li [ngbNavItem]="2">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);
		await tester.fixture.whenStable();

		const activeIdChangeSpy = vi.spyOn(tester.componentInstance, 'onActiveIdChange');

		expect(tester.componentInstance.activeId()).toBe(1);

		await tester.links.nth(1).click();

		expect(activeIdChangeSpy).toHaveBeenCalledWith(2);
		expect(tester.componentInstance.activeId()).toBe(2);
	});

	it(`should render only one nav content by default`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem>
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectContents(tester, ['content 1']);

		await tester.links.nth(1).click();

		await expectContents(tester, ['content 2']);
	});

	it(`should render all nav contents with [destroyOnHide]='false'`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs" [destroyOnHide]="false">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem>
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectContents(tester, ['content 1', 'content 2'], 0);

		await tester.links.nth(1).click();

		await expectContents(tester, ['content 1', 'content 2'], 1);
	});

	it(`should allow overriding [destroyOnHide] per nav item (destroyOnHide === true)`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem [destroyOnHide]="false">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectContents(tester, ['content 1', 'content 2'], 0);

		await tester.links.nth(1).click();

		await expectContents(tester, ['content 2']);
	});

	it(`should allow overriding [destroyOnHide] per nav item (destroyOnHide === false)`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" [destroyOnHide]="false" class="nav-tabs">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem [destroyOnHide]="true">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectContents(tester, ['content 1']);

		await tester.links.nth(1).click();

		await expectContents(tester, ['content 1', 'content 2'], 1);
	});

	it(`should work with alternative markup without <ul> and <li>`, async () => {
		const html = `
      <nav ngbNav #n="ngbNav" class="nav-tabs">
        <ng-container ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </ng-container>
        <ng-container ngbNavItem>
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </ng-container>
      </nav>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false], true);
		await expectContents(tester, ['content 1']);

		await tester.links.nth(1).click();

		await expectLinks(tester, [false, true], true);
		await expectContents(tester, ['content 2']);
	});

	it(`should work with alternative markup with links`, async () => {
		const html = `
      <nav ngbNav #n="ngbNav" class="nav-tabs">
        <ng-container ngbNavItem>
            <a ngbNavLink>link 1</a>
            <ng-template ngbNavContent>content 1</ng-template>
        </ng-container>
        <ng-container ngbNavItem>
            <a ngbNavLink>link 2</a>
            <ng-template ngbNavContent>content 2</ng-template>
        </ng-container>
      </nav>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false], true);
		await expectContents(tester, ['content 1']);

		await tester.links.nth(1).click();

		await expectLinks(tester, [false, true], true);
		await expectContents(tester, ['content 2']);
	});

	it(`should add correct CSS classes for disabled tabs`, async () => {
		const html = `
        <ul ngbNav #n="ngbNav" class="nav-tabs">
          <li ngbNavItem [disabled]="disabled()">
              <button ngbNavLink>link 1</button>
              <ng-template ngbNavContent>content 1</ng-template>
          </li>
          <li ngbNavItem [disabled]="disabled()">
              <a ngbNavLink>link 2</a>
              <ng-template ngbNavContent>content 2</ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="n"></div>
      `;
		const tester = new NavTester(html);

		await expectLinks(tester, [true, false]);
		await expect.element(tester.links.nth(0)).toHaveClass('disabled');
		await expect.element(tester.links.nth(1)).toHaveClass('disabled');
		await expect.element(tester.links.nth(0)).toBeDisabled();
		await expect.element(tester.links.nth(1)).not.toHaveAttribute('disabled');
		await expect.element(tester.links.nth(0)).toHaveAttribute('type', 'button');
		await expect.element(tester.links.nth(1)).not.toHaveAttribute('type');
		await expectContents(tester, ['content 1']);

		tester.componentInstance.disabled.set(false);

		await expectLinks(tester, [true, false]);
		await expect.element(tester.links.nth(0)).not.toHaveClass('disabled');
		await expect.element(tester.links.nth(1)).not.toHaveClass('disabled');
		await expect.element(tester.links.nth(0)).not.toBeDisabled();
		await expect.element(tester.links.nth(1)).not.toHaveAttribute('disabled');
		await expectContents(tester, ['content 1']);
	});

	it(`should set 'aria-selected', 'aria-controls' and 'aria-labelledby' attributes correctly`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem domId="one">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
        <li ngbNavItem domId="two">
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent>content 2</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.links.nth(0)).toHaveAttribute('aria-controls', 'one-panel');
		await expect.element(tester.links.nth(0)).toHaveAttribute('aria-selected', 'true');
		await expect.element(tester.links.nth(1)).not.toHaveAttribute('aria-controls');
		await expect.element(tester.links.nth(1)).toHaveAttribute('aria-selected', 'false');
		await expect.element(tester.contents).toHaveAttribute('aria-labelledby', 'one');

		await tester.links.nth(1).click();

		await expect.element(tester.links.nth(0)).not.toHaveAttribute('aria-controls');
		await expect.element(tester.links.nth(0)).toHaveAttribute('aria-selected', 'false');
		await expect.element(tester.links.nth(1)).toHaveAttribute('aria-controls', 'two-panel');
		await expect.element(tester.links.nth(1)).toHaveAttribute('aria-selected', 'true');
		await expect.element(tester.contents).toHaveAttribute('aria-labelledby', 'two');
	});

	it(`should set 'aria-disabled' attribute correctly`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs">
        <li ngbNavItem [disabled]="disabled()">
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent>content 1</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expect.element(tester.links.nth(0)).toHaveAttribute('aria-disabled', 'true');

		tester.componentInstance.disabled.set(false);

		await expect.element(tester.links.nth(0)).toHaveAttribute('aria-disabled', 'false');
	});

	it(`should pass the 'active' value to content template`, async () => {
		const html = `
      <ul ngbNav #n="ngbNav" class="nav-tabs" [destroyOnHide]="false">
        <li ngbNavItem>
            <button ngbNavLink>link 1</button>
            <ng-template ngbNavContent let-active>1-{{ active }}</ng-template>
        </li>
        <li ngbNavItem>
            <button ngbNavLink>link 2</button>
            <ng-template ngbNavContent let-active>2-{{ active }}</ng-template>
        </li>
      </ul>
      <div [ngbNavOutlet]="n"></div>
    `;
		const tester = new NavTester(html);

		await expectContents(tester, ['1-true', '2-false'], 0);

		await tester.links.nth(1).click();

		await expectContents(tester, ['1-false', '2-true'], 1);
	});

	describe(`nav keyboard navigation`, () => {
		it(`should not work for nav with role different from 'tablist`, async () => {
			const html = `
        <ul ngbNav #n="ngbNav" [roles]="false" class="nav-tabs">
          <li ngbNavItem>
              <button ngbNavLink></button>
              <ng-template ngbTabContent></ng-template>
          </li>
          <li ngbNavItem>
              <button ngbNavLink></button>
              <ng-template ngbTabContent></ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="n"></div>
      `;
			const tester = new NavTester(html);

			await userEvent.tab();

			await expect.element(tester.links.nth(0)).toHaveFocus();

			await userEvent.keyboard('{ArrowRight>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
		});

		it(`should ignore disabled tabs`, async () => {
			const html = `
				<ul ngbNav #n="ngbNav" class="nav-tabs">
					<li [ngbNavItem]="1">
							<button ngbNavLink>link 1</button>
							<ng-template ngbNavContent>content 1</ng-template>
					</li>
					<li [ngbNavItem]="2" [disabled]="true">
							<button ngbNavLink>disabled</button>
							<ng-template ngbNavContent>content 2</ng-template>
					</li>
					<li [ngbNavItem]="3">
							<button ngbNavLink>link 3</button>
							<ng-template ngbNavContent>content 3</ng-template>
					</li>
				</ul>
				<div [ngbNavOutlet]="n"></div>
			`;
			const tester = new NavTester(html);

			await userEvent.tab();

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{ArrowRight>}');

			await expect.element(tester.links.nth(2)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);
		});

		it(`should move focus correctly between tablinks on 'arrow right', 'arrow left', 'home', 'end'`, async () => {
			const html = `
        <ul ngbNav #n="ngbNav" class="nav-tabs">
          <li ngbNavItem>
              <button ngbNavLink></button>
              <ng-template ngbTabContent></ng-template>
          </li>
          <li ngbNavItem>
              <button ngbNavLink></button>
              <ng-template ngbTabContent></ng-template>
          </li>
          <li ngbNavItem>
              <button ngbNavLink></button>
              <ng-template ngbTabContent></ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="n"></div>
      `;
			const tester = new NavTester(html);

			await userEvent.tab();

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{ArrowRight>}');

			await expect.element(tester.links.nth(1)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/ArrowRight}');
			await userEvent.keyboard('{ArrowLeft>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/ArrowLeft}');
			await userEvent.keyboard('{End>}');
			await expect.element(tester.links.nth(2)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/End}');
			await userEvent.keyboard('{Home>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/Home}');
		});

		it(`should move focus correctly for vertical nav on 'arrow down', 'arrow up', 'home', 'end'`, async () => {
			const html = `
				<ul ngbNav #n="ngbNav" class="nav-tabs" orientation="vertical">
					<li ngbNavItem>
							<button ngbNavLink></button>
							<ng-template ngbTabContent></ng-template>
					</li>
					<li ngbNavItem>
							<button ngbNavLink></button>
							<ng-template ngbTabContent></ng-template>
					</li>
					<li ngbNavItem>
							<button ngbNavLink></button>
							<ng-template ngbTabContent></ng-template>
					</li>
				</ul>
				<div [ngbNavOutlet]="n"></div>
			`;
			const tester = new NavTester(html);

			await userEvent.tab();

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{ArrowDown>}');

			await expect.element(tester.links.nth(1)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/ArrowDown}');
			await userEvent.keyboard('{ArrowUp>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/ArrowUp}');
			await userEvent.keyboard('{End>}');
			await expect.element(tester.links.nth(2)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/End}');
			await userEvent.keyboard('{Home>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/Home}');
		});

		it(`should change tab and focus  on 'arrow right', 'arrow left', 'home', 'end' when keyboard is 'changeWithArrows'`, async () => {
			const html = `
          <ul ngbNav #n="ngbNav" class="nav-tabs" keyboard="changeWithArrows">
            <li ngbNavItem>
                <button ngbNavLink></button>
                <ng-template ngbTabContent></ng-template>
            </li>
            <li ngbNavItem>
                <button ngbNavLink></button>
                <ng-template ngbTabContent></ng-template>
            </li>
            <li ngbNavItem>
                <button ngbNavLink></button>
                <ng-template ngbTabContent></ng-template>
            </li>
          </ul>
          <div [ngbNavOutlet]="n"></div>
        `;
			const tester = new NavTester(html);

			await userEvent.tab();

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{ArrowRight>}');

			await expect.element(tester.links.nth(1)).toHaveFocus();
			await expectLinks(tester, [false, true, false]);

			await userEvent.keyboard('{/ArrowRight}');
			await userEvent.keyboard('{ArrowLeft>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/ArrowLeft}');
			await userEvent.keyboard('{End>}');
			await expect.element(tester.links.nth(2)).toHaveFocus();
			await expectLinks(tester, [false, false, true]);

			await userEvent.keyboard('{/End}');
			await userEvent.keyboard('{Home>}');

			await expect.element(tester.links.nth(0)).toHaveFocus();
			await expectLinks(tester, [true, false, false]);

			await userEvent.keyboard('{/Home}');
		});
	});
});

if (isBrowserVisible('ngb-nav animations')) {
	describe('ngb-nav animations', () => {
		@Component({
			imports: [NgbNavContent, NgbNav, NgbNavItem, NgbNavItemRole, NgbNavLinkButton, NgbNavLinkBase, NgbNavOutlet],
			template: `
				<ul ngbNav #n="ngbNav" class="nav-tabs" (shown)="onNavShownSpy($event)" (hidden)="onNavHiddenSpy($event)">
					<li [ngbNavItem]="1" (shown)="onItemShownSpy(1)" (hidden)="onItemHiddenSpy(1)">
						<button ngbNavLink>link 1</button>
						<ng-template ngbNavContent>content 1</ng-template>
					</li>
					<li [ngbNavItem]="2" (shown)="onItemShownSpy(2)" (hidden)="onItemHiddenSpy(2)">
						<button ngbNavLink>link 2</button>
						<ng-template ngbNavContent>content 2</ng-template>
					</li>
					<li [ngbNavItem]="3" (shown)="onItemShownSpy(3)" (hidden)="onItemHiddenSpy(3)">
						<button ngbNavLink>link 2</button>
						<ng-template ngbNavContent>content 3</ng-template>
					</li>
				</ul>
				<div [ngbNavOutlet]="n"></div>
			`,
			host: { '[class.ngb-reduce-motion]': 'reduceMotion()' },
			changeDetection: ChangeDetectionStrategy.OnPush,
		})
		class TestAnimationComponent {
			reduceMotion = signal(false);
			onItemHiddenSpy = vi.fn();
			onItemShownSpy = vi.fn();
			onNavHiddenSpy = vi.fn();
			onNavShownSpy = vi.fn();
		}

		class NavAnimationTester {
			readonly fixture = TestBed.createComponent(TestAnimationComponent);
			readonly componentInstance = this.fixture.componentInstance;
			readonly links = page.getByCss('[ngbNavLink]');
			readonly outlet = page.getByCss('.tab-content');
			readonly contents = this.outlet.getByCss('*');

			clickLinkSync(i: number) {
				(this.links.nth(i).element() as HTMLElement).click();
			}
		}

		let transitionTimerDelayMs: Mock;

		beforeEach(() => {
			transitionTimerDelayMs = vi.spyOn(environment, 'getTransitionTimerDelayMs').mockReturnValue(100);
			TestBed.configureTestingModule({
				providers: [{ provide: NgbConfig, useClass: NgbConfigAnimation }],
			});
		});

		afterEach(() => {
			transitionTimerDelayMs.mockRestore();
		});

		function expectLinksSync(tester: NavAnimationTester, expected: boolean[], shouldHaveNavItemClass = false) {
			expect(tester.links, `expected to find ${expected.length} links`).toHaveLength(expected.length);

			for (let i = 0; i < expected.length; i++) {
				const link = tester.links.nth(i);
				expect(link).toHaveClass('nav-link');
				if (expected[i]) {
					expect(link).toHaveClass('active');
				} else {
					expect(link).not.toHaveClass('active');
				}

				if (shouldHaveNavItemClass) {
					expect(link).toHaveClass('nav-item');
				} else {
					expect(link).not.toHaveClass('nav-item');
				}
			}
		}

		function expectContentsSync(tester: NavAnimationTester, expected: string[], activeIndex = 0) {
			expect(tester.contents, `expected to find ${expected.length} contents`).toHaveLength(expected.length);

			for (let i = 0; i < expected.length; i++) {
				expect(tester.contents.nth(i)).toHaveTextContent(expected[i]);
				if (i === activeIndex) {
					expect(tester.contents.nth(i)).toHaveClass('active');
				} else {
					expect(tester.contents.nth(i)).not.toHaveClass('active');
				}
			}
		}

		function expectContentState(pane: Locator, classes: string[], noClasses: string[], opacity: string) {
			classes.forEach((c) => expect(pane).toHaveClass(c));
			noClasses.forEach((c) => expect(pane).not.toHaveClass(c));
			expect(window.getComputedStyle(pane.element()).opacity).toBe(opacity);
		}

		it(`should run simple fade in/out transition when switching navs (force-reduced-motion = true)`, async () => {
			const tester = new NavAnimationTester();
			const { onItemHiddenSpy, onItemShownSpy, onNavHiddenSpy, onNavShownSpy } = tester.componentInstance;
			tester.componentInstance.reduceMotion.set(true);
			await tester.fixture.whenStable();

			// 1. checking links have good initial values (1 is active)
			expectLinksSync(tester, [true, false, false]);
			expectContentsSync(tester, ['content 1']);
			expectContentState(tester.contents, ['fade', 'show'], [], '1');

			// 2. switching from 1 -> 2
			tester.clickLinkSync(1);
			await tester.fixture.whenStable();

			// 3. everything is updated synchronously
			expectLinksSync(tester, [false, true, false]);
			expectContentsSync(tester, ['content 2']);
			expectContentState(tester.contents, ['fade', 'show'], [], '1');
			expect(vi.mocked(onItemHiddenSpy).mock.calls).toEqual([[1]]);
			expect(vi.mocked(onNavHiddenSpy).mock.calls).toEqual([[1]]);
			expect(vi.mocked(onItemShownSpy).mock.calls).toEqual([[2]]);
			expect(vi.mocked(onNavShownSpy).mock.calls).toEqual([[2]]);
		});

		// FIXME: WebKit seems to have problems with transitionend events in CI environment
		it.skipIf(server.browser === 'webkit')(
			`should run simple fade in/out transition when switching navs (force-reduced-motion = false)`,
			async () => {
				const tester = new NavAnimationTester();
				const { onItemHiddenSpy, onItemShownSpy, onNavHiddenSpy, onNavShownSpy } = tester.componentInstance;
				tester.componentInstance.reduceMotion.set(false);
				await tester.fixture.whenStable();

				// TEST: 1 is active, switching 1 -> 2, catching nav (hidden), catching nav (shown)

				// 1. checking links have good initial values (1 is active)
				expectLinksSync(tester, [true, false, false]);
				expectContentsSync(tester, ['content 1']);
				expectContentState(tester.contents, ['fade', 'show'], [], '1');

				const hiddenPromise = new Promise<void>((resolve) =>
					onNavHiddenSpy.mockImplementation((hiddenId) => {
						expect(hiddenId).toBe(1);
						resolve();
					}),
				);

				// 2. switching from 1 -> 2
				tester.clickLinkSync(1);
				await tester.fixture.whenStable();

				// 3. links are updated synchronously
				expectLinksSync(tester, [false, true, false]);

				// 4. adding 2nd content, 1st still active
				expectContentsSync(tester, ['content 1', 'content 2'], 0);
				expectContentState(tester.contents.nth(0), ['fade'], ['show'], '1');
				expectContentState(tester.contents.nth(1), ['fade'], ['show'], '0');

				// 5. (hidden) was fired on the nav
				await hiddenPromise;

				const shownPromise = new Promise<void>((resolve) =>
					onNavShownSpy.mockImplementation((shownId) => {
						expect(shownId).toBe(2);
						resolve();
					}),
				);
				await tester.fixture.whenStable();
				expectContentsSync(tester, ['content 2']);
				expectContentState(tester.contents, ['fade', 'show'], [], '0');

				// 6. (shown) was fired on the nav
				await shownPromise;
				await tester.fixture.whenStable();
				expect(vi.mocked(onItemHiddenSpy).mock.calls).toEqual([[1]]);
				expect(vi.mocked(onItemShownSpy).mock.calls).toEqual([[2]]);
				expectContentsSync(tester, ['content 2']);
				expectContentState(tester.contents, ['fade', 'show'], [], '1');
			},
		);

		// FIXME: WebKit seems to have problems with transitionend events in CI environment
		it.skipIf(server.browser === 'webkit')(
			`should fade in to the new pane if switched after fading out has started already`,
			async () => {
				const tester = new NavAnimationTester();
				const { onItemHiddenSpy, onItemShownSpy, onNavHiddenSpy, onNavShownSpy } = tester.fixture.componentInstance;
				tester.componentInstance.reduceMotion.set(false);
				await tester.fixture.whenStable();

				// TEST: 1 is active, switching 1 -> 2, switching 2 -> 3 while fading out 1, catching nav (shown)

				// 1. checking links have good initial values (1 is active)
				expectLinksSync(tester, [true, false, false]);
				expectContentsSync(tester, ['content 1']);
				expectContentState(tester.contents, ['fade', 'show'], [], '1');

				const shownPromise = new Promise<void>((resolve) =>
					onNavShownSpy.mockImplementation((shownId) => {
						expect(shownId).toBe(3);
						resolve();
					}),
				);

				// 2. switching from 1 -> 2
				tester.clickLinkSync(1);
				await tester.fixture.whenStable();

				// 3. links are updated synchronously
				expectLinksSync(tester, [false, true, false]);

				// 4. adding 2nd content, 1st still active
				expectContentsSync(tester, ['content 1', 'content 2'], 0);
				expectContentState(tester.contents.nth(0), ['fade'], ['show'], '1');
				expectContentState(tester.contents.nth(1), ['fade'], ['show'], '0');

				// 5. switching from 2 -> 3 immediately
				tester.clickLinkSync(2);
				await tester.fixture.whenStable();

				// 6. links are updated synchronously
				expectLinksSync(tester, [false, false, true]);

				// 7. removing 2nd, adding 3rd content, 1st still active
				expectContentsSync(tester, ['content 1', 'content 3'], 0);
				expectContentState(tester.contents.nth(0), ['fade'], ['show'], '1');
				expectContentState(tester.contents.nth(1), ['fade'], ['show'], '0');

				// 8. (shown) should be fired only when switching 2 -> 3
				await shownPromise;
				await tester.fixture.whenStable();
				expect(onNavHiddenSpy).toHaveBeenCalledWith(1);
				expect(onItemHiddenSpy).toHaveBeenCalledWith(1);
				expect(onItemShownSpy).toHaveBeenCalledWith(3);
				expectContentsSync(tester, ['content 3']);
				expectContentState(tester.contents, ['fade', 'show'], [], '1');
			},
		);

		// FIXME: WebKit seems to have problems with transitionend events in CI environment
		it.skipIf(server.browser === 'webkit')(
			`should reverse fade in if switched to a new pane after fading in has started already`,
			async () => {
				const tester = new NavAnimationTester();
				const { onItemHiddenSpy, onItemShownSpy, onNavHiddenSpy, onNavShownSpy } = tester.componentInstance;
				tester.componentInstance.reduceMotion.set(false);
				await tester.fixture.whenStable();

				// TEST: 1 is active, switching 1 -> 2, switching 2 -> 3 while fading in 2, catching nav (shown)
				// 1. checking links have good initial values (1 is active)
				expectLinksSync(tester, [true, false, false]);
				expectContentsSync(tester, ['content 1']);
				expectContentState(tester.contents, ['fade', 'show'], [], '1');

				await new Promise<void>((done) => {
					onNavHiddenSpy.mockImplementation(async (hiddenId) => {
						// 5. (hidden) is fired 2 times, for 1 -> 2 them for 2 -> 3
						// we care only about the 1 -> 2
						if (hiddenId === 1) {
							await tester.fixture.whenStable();
							expectContentsSync(tester, ['content 2']);
							expectContentState(tester.contents, ['fade', 'show'], [], '0');

							// 6. switching 2 -> 3
							tester.clickLinkSync(2);
							await tester.fixture.whenStable();

							// 7. links are updated synchronously
							expectLinksSync(tester, [false, false, true]);

							// 8. adding 3rd content, 2nd still active (only starting fading in)
							expectContentsSync(tester, ['content 2', 'content 3'], 0);
							expectContentState(tester.contents.nth(0), ['fade'], ['show'], '0');
							expectContentState(tester.contents.nth(1), ['fade'], ['show'], '0');
						}
					});

					onNavShownSpy.mockImplementation(async (shownId) => {
						// 9. (shown) is fired only for 2 -> 3
						await tester.fixture.whenStable();
						expect(shownId).toBe(3);
						expect(vi.mocked(onNavHiddenSpy).mock.calls).toEqual([[1], [2]]);
						expect(vi.mocked(onItemHiddenSpy).mock.calls).toEqual([[1], [2]]);
						expect(vi.mocked(onItemShownSpy).mock.calls).toEqual([[3]]);
						expectContentsSync(tester, ['content 3']);
						expectContentState(tester.contents, ['fade', 'show'], [], '1');
						done();
					});

					// 2. switching from 1 -> 2
					tester.clickLinkSync(1);
					tester.fixture.whenStable().then(() => {
						// 3. links are updated synchronously
						expectLinksSync(tester, [false, true, false]);

						// 4. adding 2nd content, 1st still active
						expectContentsSync(tester, ['content 1', 'content 2'], 0);
						expectContentState(tester.contents.nth(0), ['fade'], ['show'], '1');
						expectContentState(tester.contents.nth(1), ['fade'], ['show'], '0');
					});
				});
			},
		);
	});
}

@Component({
	selector: 'test-cmp',
	template: '',
	imports: [
		NgbNavContent,
		NgbNav,
		NgbNavItem,
		NgbNavItemRole,
		NgbNavLink,
		NgbNavLinkButton,
		NgbNavLinkBase,
		NgbNavOutlet,
		NgbNavPane,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
	activeId = signal<number | boolean | string | undefined>(undefined);
	disabled = signal(true);
	items = signal([1, 2]);
	orientation = signal('horizontal');
	roles = signal<'tablist' | false>('tablist');
	visible = signal(false);
	onActiveIdChange = (id) => {};
	onNavChange = () => {};
	onItemHidden = () => {};
	onItemShown = () => {};
	onNavHidden = () => {};
	onNavShown = () => {};
	onNavChangePrevent = (event) => {
		if (isDefined(event.activeId)) {
			event.preventDefault();
		}
	};
}
