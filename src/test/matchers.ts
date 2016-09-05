beforeEach(() => {
  jasmine.addMatchers({
    toHaveCssClass: function(util, customEqualityTests) {
      return {compare: buildError(false), negativeCompare: buildError(true)};

      function buildError(isNot: boolean) {
        return function(actual: HTMLElement, className: string) {
          return {
            pass: actual.classList.contains(className) === !isNot,
            get message() {
              return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
            }
          };
        };
      }
    }
  });
});
