import { Observable, EMPTY } from 'rxjs';

const ALIASES = {
	hover: ['mouseenter', 'mouseleave'],
	focus: ['focusin', 'focusout'],
};

export function parseTriggers(triggers: string): [string, string?][] {
	const trimmedTriggers = (triggers || '').trim();

	if (trimmedTriggers.length === 0) {
		return [];
	}

	const parsedTriggers = trimmedTriggers
		.split(/\s+/)
		.map((trigger) => trigger.split(':'))
		.map((triggerPair) => (ALIASES[triggerPair[0]] || triggerPair) as [string, string?]);

	const manualTriggers = parsedTriggers.filter((triggerPair) => triggerPair.includes('manual'));

	if (manualTriggers.length > 1) {
		throw `Triggers parse error: only one manual trigger is allowed`;
	}

	if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
		throw `Triggers parse error: manual trigger can't be mixed with other triggers`;
	}

	return manualTriggers.length ? [] : parsedTriggers;
}

export function listenToTriggers(
	element: HTMLElement,
	triggers: string,
	isOpenedFn: () => boolean,
	openFn: () => void,
	closeFn: () => void,
	openDelayMs = 0,
	closeDelayMs = 0,
	enterPopover: Observable<void> = EMPTY,
	leavePopover: Observable<void> = EMPTY,
) {
	const parsedTriggers = parseTriggers(triggers);

	if (parsedTriggers.length === 0) {
		return () => {};
	}

	const activeOpenTriggers = new Set<string>();
	const cleanupFns: (() => void)[] = [];
	let timeout: any;

	function addEventListener(name: string, listener: () => void) {
		element.addEventListener(name, listener);
		cleanupFns.push(() => element.removeEventListener(name, listener));
	}

	function withDelay(fn: () => void, delayMs: number) {
		clearTimeout(timeout);
		if (delayMs > 0) {
			timeout = setTimeout(fn, delayMs);
		} else {
			fn();
		}
	}

	for (const [openTrigger, closeTrigger] of parsedTriggers) {
		if (!closeTrigger) {
			addEventListener(openTrigger, () =>
				isOpenedFn() ? withDelay(closeFn, closeDelayMs) : withDelay(openFn, openDelayMs),
			);
		} else {
			addEventListener(openTrigger, () => {
				activeOpenTriggers.add(openTrigger);
				withDelay(() => activeOpenTriggers.size > 0 && openFn(), openDelayMs);
			});
			addEventListener(closeTrigger, () => {
				activeOpenTriggers.delete(openTrigger);
				withDelay(() => activeOpenTriggers.size === 0 && closeFn(), closeDelayMs);
			});
		}

		if (openTrigger === 'mouseenter' && closeTrigger === 'mouseleave' && closeDelayMs > 0) {
			enterPopover.subscribe(() => {
				activeOpenTriggers.add(openTrigger);
				clearTimeout(timeout);
			});
			leavePopover.subscribe(() => {
				activeOpenTriggers.delete(openTrigger);
				withDelay(() => activeOpenTriggers.size === 0 && closeFn(), closeDelayMs);
			});
		}
	}

	return () => cleanupFns.forEach((cleanupFn) => cleanupFn());
}
