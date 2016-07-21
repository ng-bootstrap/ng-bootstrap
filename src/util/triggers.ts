export class Trigger {
  constructor(public open: string, public close?: string) {
    if (!close) {
      this.close = open;
    }
  }

  isManual() { return this.open === 'manual' || this.close === 'manual'; }
}

const DEFAULT_ALIASES = {
  hover: ['mouseenter', 'mouseleave']
};

export function parseTriggers(triggers: string, aliases = DEFAULT_ALIASES): Trigger[] {
  const trimmedTriggers = (triggers || '').trim();

  if (trimmedTriggers.length === 0) {
    return [];
  }

  const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
    let alias = aliases[triggerPair[0]] || triggerPair;
    return new Trigger(alias[0], alias[1]);
  });

  const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());

  if (manualTriggers.length > 1) {
    throw 'Triggers parse error: only one manual trigger is allowed';
  }

  if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
    throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
  }

  return parsedTriggers;
}

export function listenToTriggers(renderer: any, nativeElement: any, triggers: string, openFn, closeFn, toggleFn) {
  const parsedTriggers = parseTriggers(triggers);
  const listeners = [];

  if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
    return;
  }

  parsedTriggers.forEach((trigger: Trigger) => {
    if (trigger.open === trigger.close) {
      listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
    } else {
      listeners.push(
          renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
    }
  });

  return () => { this._listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}
