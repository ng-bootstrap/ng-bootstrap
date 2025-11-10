import {
	toInteger,
	toString,
	getValueInRange,
	isInteger,
	isString,
	removeAccents,
	closest,
	isPromise,
	getActiveElement,
} from './util';

describe('util', () => {
	describe('closest', () => {
		describe('when no selector is provided', () => {
			it('should return null', () => {
				const element = document.createElement('div');

				expect(closest(element)).toBeNull();
			});
		});

		describe('when selector is provided', () => {
			it('should return the closest element', () => {
				const element = document.body;

				expect(closest(element, 'html')).toEqual(document.documentElement);
			});
		});

		describe('when HTMLDocument is provided', () => {
			it('should return null if selector is not matching document', () => {
				const element = document.documentElement;

				expect(closest(element, 'body')).toBeNull();
			});
		});
	});

	describe('toInteger', () => {
		it('should be noop for integers', () => {
			expect(toInteger(0)).toBe(0);
			expect(toInteger(10)).toBe(10);
		});

		it('should act as Math.floor for numbers', () => {
			expect(toInteger(0.1)).toBe(0);
			expect(toInteger(0.9)).toBe(0);
		});

		it('should parse strings', () => {
			expect(toInteger('0')).toBe(0);
			expect(toInteger('10')).toBe(10);
			expect(toInteger('10.1')).toBe(10);
			expect(toInteger('10.9')).toBe(10);
		});
	});

	describe('toString', () => {
		it('should be noop for strings', () => {
			expect(toString('foo')).toBe('foo');
		});

		it('should return empty string for undefined values', () => {
			expect(toString(null)).toBe('');
			expect(toString(undefined)).toBe('');
		});

		it('should stringify non-string values', () => {
			expect(toString(10)).toBe('10');
			expect(toString(false)).toBe('false');
		});
	});

	describe('getValueInRange', () => {
		it('should be noop for numbers in range', () => {
			expect(getValueInRange(5, 10, 0)).toBe(5);
		});

		it('should do corrections in range', () => {
			expect(getValueInRange(11, 10, 0)).toBe(10);
			expect(getValueInRange(-1, 10, 0)).toBe(0);
		});

		it('should take 0 as a default min bound', () => {
			expect(getValueInRange(11, 10)).toBe(10);
			expect(getValueInRange(-1, 10)).toBe(0);
		});
	});

	describe('isInteger', () => {
		it('should recognize integers', () => {
			expect(isInteger(0)).toBeTruthy();
			expect(isInteger(10)).toBeTruthy();
			expect(isInteger(-110)).toBeTruthy();
		});

		it('should recognize non-integers', () => {
			expect(isInteger(null)).toBeFalsy();
			expect(isString([])).toBeFalsy();
			expect(isString(undefined)).toBeFalsy();
			expect(isInteger('2048')).toBeFalsy();
			expect(isInteger(14.1)).toBeFalsy();
			expect(isInteger(-14.1)).toBeFalsy();
		});
	});

	describe('isString', () => {
		it('should recognize strings', () => {
			expect(isString('string')).toBeTruthy();
			expect(isString('')).toBeTruthy();
		});

		it('should recognize non-strings', () => {
			expect(isString(null)).toBeFalsy();
			expect(isString(2048)).toBeFalsy();
			expect(isString([])).toBeFalsy();
			expect(isString(undefined)).toBeFalsy();
		});
	});

	describe('isPromise', () => {
		it('should recognize Promises', () => {
			expect(isPromise(new Promise(() => {}))).toBeTruthy();
			expect(isPromise(Promise.resolve())).toBeTruthy();
		});

		it('should recognize non-Promises', () => {
			expect(isPromise(null)).toBeFalsy();
			expect(isPromise(2048)).toBeFalsy();
			expect(isPromise([])).toBeFalsy();
			expect(isPromise({})).toBeFalsy();
			expect(isPromise(Function)).toBeFalsy();
			expect(isPromise(undefined)).toBeFalsy();
		});
	});

	if (typeof String.prototype.normalize !== 'undefined') {
		describe('removeAccents', () => {
			it('should remove accents from string correctly when String.prototype.normalize is defined', () => {
				expect(removeAccents('àâäéèêëîïôöûüùçÂÊÎÔÛÄËÏÖÜÀ "^" "¨" no accent')).toBe(
					'aaaeeeeiioouuucAEIOUAEIOUA "^" "¨" no accent',
				);
			});
		});
	} else {
		describe('removeAccents', () => {
			it('should throw an error when String.prototype.normalize is undefined', () => {
				expect(function () {
					removeAccents('àâäéèêëîïôöûüùçÂÊÎÔÛÄËÏÖÜÀ "^" "¨" no accent');
				}).toThrow();
			});
		});
	}

	describe('getActiveElement', () => {
		it('should return nothing for a wrong element', () => {
			expect(getActiveElement(null as any)).toEqual(null);
			expect(getActiveElement(document.createElement('div') as any)).toEqual(null);
		});

		it('should return focused element', () => {
			expect(getActiveElement(document)).toEqual(document.body);

			const input = document.createElement('input');
			document.body.appendChild(input);
			input.focus();

			expect(getActiveElement(document)).toEqual(input);
			document.body.removeChild(input);
		});

		it('should return focused element from the shadow dom', () => {
			const div = document.createElement('div');
			div.attachShadow({ mode: 'open' });
			const input = document.createElement('input');
			div.shadowRoot!.appendChild(input);
			document.body.appendChild(div);
			input.focus();

			expect(getActiveElement(document)).toEqual(input);
			document.body.removeChild(div);
		});
	});
});
