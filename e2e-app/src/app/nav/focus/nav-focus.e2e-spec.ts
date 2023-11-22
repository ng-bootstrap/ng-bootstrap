import { expect } from '@playwright/test';
import { getPage, setPage, test } from '../../../../baseTest';
import { sendKey } from '../../tools.po';

const expectFocused = async (selector: string) => {
	await expect(getPage().locator(`${selector}`), `${selector} should be focused`).toBeFocused();
};

const selectKeyboard = async (type: string) => {
	await getPage().click('#keyboard-dropdown');
	await getPage().click(`#keyboard-${type}`);
	await getPage().focus('#before');
};

const expectFocusedNav = async (index: number) => {
	await expectFocused(`#nav-${index}`);
};

const expectSelectedNav = async (index: number) => {
	expect(await getPage().getAttribute(`#nav-${index}`, 'class'), `nav-${index} should be selected`).toContain('active');
	await expect(getPage().locator(`#nav-${index}-panel`), `nav-${index}-panel should be visible`).toBeVisible();
};

test.use({ testURL: 'nav/focus', testSelector: 'h3:text("Nav focus")' });
test.beforeEach(async ({ page }) => setPage(page));

test.describe(`Nav focus`, () => {
	test(`should work with keyboard = true`, async () => {
		await selectKeyboard('true');
		await expectSelectedNav(2);
		await expectFocused('#before');

		// Tab to select nav 2
		await sendKey('Tab');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Arrow right to focus nav 3
		await sendKey('ArrowRight');
		await expectFocusedNav(3);
		await expectSelectedNav(2);

		// Arrow down to focus nav 1
		await sendKey('ArrowDown');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Arrow left to focus nav 3
		await sendKey('ArrowLeft');
		await expectFocusedNav(3);
		await expectSelectedNav(2);

		// Arrow up to focus nav 2
		await sendKey('ArrowUp');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Home to focus nav 1
		await sendKey('Home');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// End to focus nav 3
		await sendKey('End');
		await expectFocusedNav(3);

		// Enter to select nav 3
		await sendKey('Enter');
		await expectFocusedNav(3);
		await expectSelectedNav(3);

		// Arrow left to focus nav 2
		await sendKey('ArrowLeft');
		await expectFocusedNav(2);
		await expectSelectedNav(3);

		// Space to select nav 2
		await sendKey(' ');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Arrow left to focus nav 1
		await sendKey('ArrowLeft');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Tab to exit to 'after'
		await sendKey('Tab');
		await expectFocused('#after');

		// Shift-Tab to return to nav 2
		await sendKey('Shift+Tab');
		await expectFocusedNav(2);
		await expectSelectedNav(2);
	});

	test(`should work with keyboard = false`, async () => {
		await selectKeyboard('false');
		await expectFocused('#before');
		await expectSelectedNav(2);

		// Tab to focus nav 1
		await sendKey('Tab');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Arrow right does nothing
		await sendKey('ArrowRight');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Arrow left does nothing
		await sendKey('ArrowLeft');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Arrow down does nothing
		await sendKey('ArrowDown');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Arrow up does nothing
		await sendKey('ArrowUp');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Home does nothing
		await sendKey('Home');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// End does nothing
		await sendKey('End');
		await expectFocusedNav(1);
		await expectSelectedNav(2);

		// Enter selects nav 1
		await sendKey('Enter');
		await expectFocusedNav(1);
		await expectSelectedNav(1);

		// Tab moves to focus the nav 2
		await sendKey('Tab');
		await expectFocusedNav(2);
		await expectSelectedNav(1);

		// Space selects nav 2
		await sendKey(' ');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Tab moves to focus the nav 3
		await sendKey('Tab');
		await expectFocusedNav(3);
		await expectSelectedNav(2);

		// Tab moves to focus the 'after'
		await sendKey('Tab');
		await expectFocused('#after');

		// Shift tab moves to focus back to nav 3
		await sendKey('Shift+Tab');
		await expectFocusedNav(3);
		await expectSelectedNav(2);
	});

	test(`should work with keyboard = 'changeWithArrows'`, async () => {
		await selectKeyboard('arrows');
		await expectFocused('#before');
		await expectSelectedNav(2);

		// Tab to focus nav 2
		await sendKey('Tab');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Arrow right to select nav 3
		await sendKey('ArrowRight');
		await expectFocusedNav(3);
		await expectSelectedNav(3);

		// Arrow down to select nav 1
		await sendKey('ArrowDown');
		await expectFocusedNav(1);
		await expectSelectedNav(1);

		// Arrow left to select nav 3
		await sendKey('ArrowLeft');
		await expectFocusedNav(3);
		await expectSelectedNav(3);

		// Arrow up to select nav 2
		await sendKey('ArrowUp');
		await expectFocusedNav(2);
		await expectSelectedNav(2);

		// Home to select nav 1
		await sendKey('Home');
		await expectFocusedNav(1);
		await expectSelectedNav(1);

		// End to select nav 3
		await sendKey('End');
		await expectFocusedNav(3);
		await expectSelectedNav(3);

		// Tab to exit to 'after'
		await sendKey('Tab');
		await expectFocused('#after');

		// Shift-Tab to return to nav 3
		await sendKey('Shift+Tab');
		await expectFocusedNav(3);
		await expectSelectedNav(3);
	});
});
