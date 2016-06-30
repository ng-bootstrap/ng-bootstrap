import {getDOM} from '@angular/platform-browser/src/dom/dom_adapter';

beforeEach(() => {
  jasmine.addMatchers({
    toHaveCssClass: function(util, customEqualityTests) {
      return {compare: buildError(false), negativeCompare: buildError(true)};

      function buildError(isNot: any /** TODO #???? */) {
        return function(actual: any /** TODO #???? */, className: any /** TODO #???? */) {
          return {
            pass: getDOM().hasClass(actual, className) === !isNot,
            get message() {
              return `Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}to contain the CSS class "${className}"`;
            }
          };
        };
      }
    }
  });
});
