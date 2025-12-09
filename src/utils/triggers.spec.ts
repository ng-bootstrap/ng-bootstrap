import { listenToTriggers, parseTriggers } from './triggers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('triggers', () => {
	describe('parseTriggers', () => {
		it('should parse single trigger', () => {
			expect(parseTriggers('foo')).toEqual([['foo']]);
		});

		it('should parse open:close form', () => {
			expect(parseTriggers('foo:bar')).toEqual([['foo', 'bar']]);
		});

		it('should parse multiple triggers', () => {
			expect(parseTriggers('foo:bar bar:baz')).toEqual([
				['foo', 'bar'],
				['bar', 'baz'],
			]);
		});

		it('should parse multiple triggers with mixed forms', () => {
			expect(parseTriggers('foo bar:baz')).toEqual([['foo'], ['bar', 'baz']]);
		});

		it('should properly trim excessive white-spaces', () => {
			expect(parseTriggers('foo   bar  \n baz ')).toEqual([['foo'], ['bar'], ['baz']]);
		});

		it('should lookup and translate special aliases', () => {
			expect(parseTriggers('hover')).toEqual([['mouseenter', 'mouseleave']]);
			expect(parseTriggers('focus')).toEqual([['focusin', 'focusout']]);
		});

		it('should detect manual triggers', () => {
			expect(parseTriggers('manual').length).toBe(0);
		});

		it('should ignore empty inputs', () => {
			expect(parseTriggers(<any>null).length).toBe(0);
			expect(parseTriggers(<any>undefined).length).toBe(0);
			expect(parseTriggers('').length).toBe(0);
		});

		it('should throw when more than one manual trigger detected', () => {
			expect(() => {
				parseTriggers('manual click manual');
			}).toThrow('Triggers parse error: only one manual trigger is allowed');
		});

		it('should throw when manual trigger is mixed with other triggers', () => {
			expect(() => {
				parseTriggers('click manual');
			}).toThrow(`Triggers parse error: manual trigger can't be mixed with other triggers`);
		});
	});

	describe('listenToTriggers', () => {
		const div = document.createElement('div');
		let states: boolean[] = [];
		let isOpenedFn = () => (states.length === 0 ? false : states[states.length - 1]);
		let openFn = vi.fn(() => states.push(true));
		let closeFn = vi.fn().mockImplementation(() => states.push(false));
		let cleanupFn: () => void;

		beforeEach(() => {
			states = [];
			cleanupFn = () => {};
			vi.useFakeTimers();
		});

		it(`should listen to 'click'`, () => {
			cleanupFn = listenToTriggers(div, 'click', isOpenedFn, openFn, closeFn);

			div.click();
			expect(states).toEqual([true]);
			expect(openFn).toHaveBeenCalledTimes(1);
			div.click();
			expect(states).toEqual([true, false]);
			expect(closeFn).toHaveBeenCalledTimes(1);
			div.click();
			expect(states).toEqual([true, false, true]);
			expect(openFn).toHaveBeenCalledTimes(2);
		});

		it(`should listen to 'focus'`, () => {
			cleanupFn = listenToTriggers(div, 'focus', isOpenedFn, openFn, closeFn);

			div.dispatchEvent(new FocusEvent('focusin'));
			expect(states).toEqual([true]);
			div.dispatchEvent(new FocusEvent('focusout'));
			expect(states).toEqual([true, false]);

			expect(openFn).toHaveBeenCalledTimes(1);
			expect(closeFn).toHaveBeenCalledTimes(1);
		});

		it(`should listen to 'hover focus'`, () => {
			cleanupFn = listenToTriggers(div, 'hover focus', isOpenedFn, openFn, closeFn);

			div.dispatchEvent(new FocusEvent('focusin'));
			div.dispatchEvent(new MouseEvent('mouseenter'));
			expect(states).toEqual([true, true]);

			div.dispatchEvent(new FocusEvent('focusout'));
			expect(states).toEqual([true, true]);
			div.dispatchEvent(new FocusEvent('mouseleave'));
			expect(states).toEqual([true, true, false]);

			expect(openFn).toHaveBeenCalledTimes(2);
			expect(closeFn).toHaveBeenCalledTimes(1);
		});

		it(`should listen to 'hover' with delays on open`, () => {
			cleanupFn = listenToTriggers(div, 'hover', isOpenedFn, openFn, closeFn, 100);

			// with delay
			div.dispatchEvent(new MouseEvent('mouseenter'));
			expect(states).toEqual([]);
			vi.advanceTimersByTime(100);
			expect(states).toEqual([true]);

			div.dispatchEvent(new FocusEvent('mouseleave'));
			expect(states).toEqual([true, false]);

			expect(openFn).toHaveBeenCalledTimes(1);
			expect(closeFn).toHaveBeenCalledTimes(1);

			states = [];

			// cancellation
			div.dispatchEvent(new MouseEvent('mouseenter')); // this should be ignored
			vi.advanceTimersByTime(50);
			expect(states).toEqual([]);
			div.dispatchEvent(new MouseEvent('mouseleave'));

			vi.advanceTimersByTime(100);
			expect(states).toEqual([false]);
		});

		it(`should listen to 'hover' with delays on close`, () => {
			cleanupFn = listenToTriggers(div, 'hover', isOpenedFn, openFn, closeFn, 0, 100);

			// with delay
			div.dispatchEvent(new MouseEvent('mouseenter'));
			expect(states).toEqual([true]);

			div.dispatchEvent(new FocusEvent('mouseleave'));
			expect(states).toEqual([true]);
			vi.advanceTimersByTime(100);
			expect(states).toEqual([true, false]);

			expect(openFn).toHaveBeenCalledTimes(1);
			expect(closeFn).toHaveBeenCalledTimes(1);

			states = [];

			// cancellation
			div.dispatchEvent(new MouseEvent('mouseenter'));
			expect(states).toEqual([true]);

			div.dispatchEvent(new MouseEvent('mouseleave')); // this should be ignored
			vi.advanceTimersByTime(50);
			expect(states).toEqual([true]);
			div.dispatchEvent(new MouseEvent('mouseenter'));

			vi.advanceTimersByTime(100);
			expect(states).toEqual([true, true]);
		});

		it('should clear delay timer if component is destroyed before openFn is called', () => {
			const delayMs = 5000;
			const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
			const fakeSetTimeoutResult = setTimeout(() => {}, 0);
			const setTimeoutSpy = vi.spyOn(window, 'setTimeout');
			setTimeoutSpy.mockReturnValue(fakeSetTimeoutResult);

			cleanupFn = listenToTriggers(div, 'hover', isOpenedFn, openFn, closeFn, delayMs);
			div.dispatchEvent(new MouseEvent('mouseenter'));
			cleanupFn();

			expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), delayMs);
			expect(clearTimeoutSpy).toHaveBeenCalledWith(fakeSetTimeoutResult);
		});

		afterEach(() => {
			vi.restoreAllMocks();
			cleanupFn();
			openFn.mockClear();
			closeFn.mockClear();
		});
	});
});
