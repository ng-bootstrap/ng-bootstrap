import {Injector, Renderer, ComponentRef, ElementRef} from '@angular/core';

export class Trigger {
  constructor(public openers: string[], public closers: string[]) {}

  isManual() { return this.openers.indexOf('manual') > -1 || this.closers.indexOf('manual') > -1; }
}

const DEFAULT_ALIASES = {
  'hover': ['mouseenter', 'mouseleave']
};

export function parseTriggers(triggers: string, aliases = DEFAULT_ALIASES): Trigger {
  let trimmedTriggers: string = (triggers || '').trim();

  if (trimmedTriggers.length === 0) {
    return null;
  }

  let openCloseTriggers: string[] = trimmedTriggers.split('/');

  let openTriggers: string[];
  let closeTriggers: string[];

  if (openCloseTriggers.length > 2) {
    throw 'Triggers parse error: triggers must have [openers]/[closers] form';
  } else if (openCloseTriggers.length === 2) {
    openTriggers = openCloseTriggers[0].split(/\s+/);
    closeTriggers = openCloseTriggers[1] ? openCloseTriggers[1].split(/\s+/) : [];
  } else if (openCloseTriggers.length === 1) {
    openTriggers = openCloseTriggers[0].split(/\s+/);
    closeTriggers = [];
  }

  // translate aliases
  for (let i = 0; i < openTriggers.length; i++) {
    let alias = (aliases[openTriggers[i]] || []);
    if (alias[0]) {
      openTriggers[i] = alias[0];
    }
    if (alias[1]) {
      closeTriggers.push(alias[1]);
    }
  }

  // manual exception
  let manualTriggers = openTriggers.filter(t => t === 'manual');
  if (manualTriggers.length > 1) {
    throw 'Triggers parse error: only one manual trigger is allowed';
  }
  if (manualTriggers.length === 1 && openTriggers.length > 1) {
    throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
  }

  manualTriggers = closeTriggers.filter(t => t === 'manual');
  if (manualTriggers.length > 1) {
    throw 'Triggers parse error: only one manual trigger is allowed';
  }
  if (manualTriggers.length === 1 && closeTriggers.length > 1) {
    throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
  }

  let trigger = new Trigger(openTriggers, closeTriggers);

  return trigger;
}

const noopFn = () => {};

export function listenToOpenTriggers(
    renderer: Renderer, nativeElement: any, triggers: string, openFn: Function, toggleFn: Function) {
  const parsedTriggers: Trigger = parseTriggers(triggers);
  const listeners: Function[] = [];

  if (parsedTriggers.isManual()) {
    return noopFn;
  }

  parsedTriggers.openers.forEach((trigger: string) => {
    if (parsedTriggers.closers.indexOf(trigger) > -1) {
      if (trigger.indexOf(':') > -1) {
        let evtWithTarget = trigger.split(':');
        listeners.push(renderer.listenGlobal(evtWithTarget[0], evtWithTarget[1], toggleFn));
      } else {
        listeners.push(renderer.listen(nativeElement, trigger, toggleFn));
      }
    } else {
      if (trigger.indexOf(':') > -1) {
        let evtWithTarget = trigger.split(':');
        listeners.push(renderer.listenGlobal(evtWithTarget[0], evtWithTarget[1], openFn));
      } else {
        listeners.push(renderer.listen(nativeElement, trigger, openFn));
      }
    }
  });

  return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}

export function listenToCloseTriggers(renderer: Renderer, nativeElement: any, triggers: string, closeFn: Function) {
  const parsedTriggers: Trigger = parseTriggers(triggers);
  const listeners: Function[] = [];

  if (parsedTriggers.isManual()) {
    return noopFn;
  }

  parsedTriggers.closers.forEach((trigger: string) => {
    if (parsedTriggers.openers.indexOf(trigger) === -1) {
      if (trigger.indexOf(':') > -1) {
        let evtWithTarget = trigger.split(':');
        listeners.push(renderer.listenGlobal(evtWithTarget[0], evtWithTarget[1], ($event) => {
          if (!nativeElement.contains($event.target)) {
            closeFn();
          }
        }));
      } else {
        listeners.push(renderer.listen(nativeElement, trigger, closeFn));
      }
    }
  });

  return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}
