// Timeouts
jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;

// Matchers
beforeEach(() => {
	jasmine.addMatchers({
		toHaveCssClass: function () {
			return { compare: buildError(false), negativeCompare: buildError(true) };

			function buildError(isNot: boolean) {
				return function (actual: HTMLElement, className: string) {
					return {
						pass: actual.classList.contains(className) === !isNot,
						message: `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`,
					};
				};
			}
		},
	});
});
