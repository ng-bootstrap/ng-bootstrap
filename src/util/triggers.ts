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

export class TriggersState {
	activeOpenTriggers = new Set<string>();
	timeout: NodeJS.Timeout;
}

export function listenToTriggers(
	element: HTMLElement,
	isPopover: boolean,
	triggers: string,
	isOpenedFn: () => boolean,
	openFn: () => void,
	closeFn: () => void,
	openDelayMs = 0,
	closeDelayMs = 0,
	mouseleaveCloseDelayMs = 0,
	focusoutCloseDelayMs = 0,
	state: TriggersState = new TriggersState(),
) {
	const parsedTriggers = parseTriggers(triggers);

	if (parsedTriggers.length === 0) {
		return () => {};
	}

	const cleanupFns: (() => void)[] = [];

	function addEventListener(name: string, listener: () => void) {
		element.addEventListener(name, listener);
		cleanupFns.push(() => element.removeEventListener(name, listener));
	}

	function withOpenDelay(fn: () => void) {
		clearTimeout(state.timeout);
		if (openDelayMs > 0) {
			state.timeout = setTimeout(fn, openDelayMs);
		} else {
			fn();
		}
	}

	function withCloseDelay(trigger: string, fn: () => void) {
		clearTimeout(state.timeout);
		// Do not handle popover clicks because it is the realm of [autoClose]
		if (isPopover && trigger === 'click') return;
		const delay =
			trigger === 'mouseleave'
				? Math.max(mouseleaveCloseDelayMs, closeDelayMs)
				: trigger === 'focusout'
				  ? Math.max(focusoutCloseDelayMs, closeDelayMs)
				  : closeDelayMs;
		if (delay > 0) {
			state.timeout = setTimeout(fn, delay);
		} else {
			fn();
		}
	}

	for (const [openTrigger, closeTrigger] of parsedTriggers) {
		if (!closeTrigger) {
			addEventListener(openTrigger, () =>
				isOpenedFn() ? withCloseDelay(openTrigger, closeFn) : withOpenDelay(openFn),
			);
		} else {
			addEventListener(openTrigger, () => {
				state.activeOpenTriggers.add(openTrigger);
				withOpenDelay(() => state.activeOpenTriggers.size > 0 && openFn());
			});
			addEventListener(closeTrigger, () => {
				state.activeOpenTriggers.delete(openTrigger);
				withCloseDelay(closeTrigger, () => state.activeOpenTriggers.size === 0 && closeFn());
			});
		}
	}

	return () => cleanupFns.forEach((cleanupFn) => cleanupFn());
}
