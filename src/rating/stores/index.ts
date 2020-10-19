import {Injectable, OnDestroy} from '@angular/core';

const symbolObservable = (typeof Symbol === 'function' && Symbol.observable) || '@@observable';

/** Callback to inform of a value updates. */
type SubscriberFunction<T> = (value: T) => void;

interface SubscriberObject<T> {
  next: SubscriberFunction<T>;
  invalidate: () => void;
}

type Subscriber<T> = SubscriberFunction<T>|Partial<SubscriberObject<T>>|null|undefined;

/** Unsubscribes from value updates. */
type UnsubscribeFunction = () => void;

interface UnsubscribeObject {
  unsubscribe: UnsubscribeFunction;
}
type Unsubscriber = UnsubscribeObject|UnsubscribeFunction;

/** Callback to update a value. */
type Updater<T> = (value: T) => T;

export interface SubscribableStore<T> {
  subscribe(subscriber: Subscriber<T>): Unsubscriber;
}

export interface Readable<T> extends SubscribableStore<T>, OnDestroy {
  subscribe(subscriber: Subscriber<T>): UnsubscribeFunction&UnsubscribeObject;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: Updater<T>): void;
}

const noop = () => {};

const bind = <T>(object: T|null|undefined, fnName: keyof T) => {
  const fn = object ? object[fnName] : null;
  return typeof fn === 'function' ? fn.bind(object) : noop;
};

const toSubscriberObject = <T>(subscriber: Subscriber<T>): SubscriberObject<T> => typeof subscriber === 'function' ?
    {next: subscriber.bind(null), invalidate: noop} :
    {next: bind(subscriber, 'next'), invalidate: bind(subscriber, 'invalidate')};

const returnThis = function<T>(this: T): T {
  return this;
};

const asReadable = <T>(store: Store<T>): Readable<T> => ({
  subscribe: store.subscribe.bind(store),
  ngOnDestroy: store.ngOnDestroy.bind(store),
  [symbolObservable]: returnThis,
});

const queue: [SubscriberFunction<any>, any][] = [];

function processQueue() {
  for (let [subscriberFn, value] of queue) {
    subscriberFn(value);
  }
  queue.length = 0;
}

const callUnsubscribe = (unsubscribe: Unsubscriber) =>
    typeof unsubscribe === 'function' ? unsubscribe() : unsubscribe.unsubscribe();

function notEqual(a: any, b: any): boolean {
  const tOfA = typeof a;
  if (tOfA !== 'function' && tOfA !== 'object') {
    return !Object.is(a, b);
  }
  return true;
}

export function get<T>(store: SubscribableStore<T>): T {
  let value: T;
  callUnsubscribe(store.subscribe((v) => (value = v)));
  return value!;
}

@Injectable()
export abstract class Store<T> implements Readable<T> {
  private _subscribers = new Set<SubscriberObject<T>>();
  private _cleanupFn: null|Unsubscriber = null;

  constructor(private _value: T) {}

  private _start() {
    this._cleanupFn = this.onUse() || noop;
  }

  private _stop() {
    const cleanupFn = this._cleanupFn;
    if (cleanupFn) {
      this._cleanupFn = null;
      callUnsubscribe(cleanupFn);
    }
  }

  protected get state() {
    return this._value;
  }

  protected set(value: T): void {
    if (notEqual(this._value, value)) {
      this._value = value;
      if (!this._cleanupFn) {
        // subscriber not yet initialized
        return;
      }
      const needsProcessQueue = queue.length == 0;
      for (const subscriber of this._subscribers) {
        subscriber.invalidate();
        queue.push([subscriber.next, value]);
      }
      if (needsProcessQueue) {
        processQueue();
      }
    }
  }

  protected update(updater: Updater<T>) {
    this.set(updater(this._value));
  }

  protected onUse(): Unsubscriber|void {}

  subscribe(subscriber: Subscriber<T>): UnsubscribeFunction&UnsubscribeObject {
    const subscriberObject = toSubscriberObject(subscriber);
    this._subscribers.add(subscriberObject);
    if (this._subscribers.size == 1) {
      this._start();
    }
    subscriberObject.next(this._value);

    const unsubscribe = () => {
      const removed = this._subscribers.delete(subscriberObject);
      if (removed && this._subscribers.size === 0) {
        this._stop();
      }
    };
    unsubscribe.unsubscribe = unsubscribe;
    return unsubscribe;
  }

  ngOnDestroy(): void {
    const hasSubscribers = this._subscribers.size > 0;
    this._subscribers.clear();
    if (hasSubscribers) {
      this._stop();
    }
  }

  [symbolObservable]() {
    return this;
  }
}

/**
 * Interface representing an argument of a function passed as a second argument to the store creation shorthands
 * (readable, writable)
 */
interface OnUseArgument<T> {
  (value: T): void;
  set: (value: T) => void;
  update: (updater: Updater<T>) => void;
}

export const readable = <T>(value: T, onUseFn: (arg: OnUseArgument<T>) => void|Unsubscriber = noop): Readable<T> => {
  const ReadableStoreWithOnUse = class extends Store<T> {
    protected onUse() {
      const setFn = (v: T) => this.set(v);
      setFn.set = setFn;
      setFn.update = (updater: Updater<T>) => this.update(updater);
      return onUseFn(setFn);
    }
  };
  return asReadable(new ReadableStoreWithOnUse(value));
};

@Injectable()
class WritableStore<T> extends Store<T> implements Writable<T> {
  constructor(value: T) {
    super(value);
  }

  set(value: T): void {
    super.set(value);
  }

  update(updater: Updater<T>) {
    super.update(updater);
  }
}

export function writable<T>(value: T, onUseFn: (arg: OnUseArgument<T>) => void|Unsubscriber = noop): Writable<T> {
  const WritableStoreWithOnUse = class extends WritableStore<T>{
    protected onUse() {
      const setFn = (v: T) => this.set(v);
      setFn.set = setFn;
      setFn.update = (updater: Updater<T>) => this.update(updater);
      return onUseFn(setFn);
    }
  };
  const store = new WritableStoreWithOnUse(value);
  return {
    ...asReadable(store),
    set: store.set.bind(store),
    update: store.update.bind(store),
  };
}

type SubscribableStores =|SubscribableStore<any>|readonly[SubscribableStore<any>, ...SubscribableStore<any>[]];

type SubscribableStoresValues<S> =
    S extends SubscribableStore<infer T>? T : {[K in keyof S]: S[K] extends SubscribableStore<infer T>? T : never};

type SyncDeriveFn<T, S> = (values: SubscribableStoresValues<S>) => T;
type AsyncDeriveFn<T, S> = (values: SubscribableStoresValues<S>, set: OnUseArgument<T>) => Unsubscriber|void;
type DeriveFn<T, S> = SyncDeriveFn<T, S>|AsyncDeriveFn<T, S>;
function isSyncDeriveFn<T, S>(fn: DeriveFn<T, S>): fn is SyncDeriveFn<T, S> {
  return fn.length <= 1;
}

@Injectable()
export abstract class DerivedStore<T, S extends SubscribableStores = SubscribableStores> extends Store<T> {
  constructor(private _stores: S, initialValue: T) {
    super(initialValue);
  }

  protected onUse() {
    let initDone = false;
    let pending = 0;

    const stores = this._stores;
    const isArray = Array.isArray(stores);
    const storesArr = isArray ? (stores as readonly SubscribableStore<any>[]) : [stores as SubscribableStore<any>];
    const dependantValues = new Array(storesArr.length);

    let cleanupFn: null|Unsubscriber = null;

    const callCleanup = () => {
      const fn = cleanupFn;
      if (fn) {
        cleanupFn = null;
        callUnsubscribe(fn);
      }
    };

    const callDerive = () => {
      if (initDone && !pending) {
        callCleanup();
        cleanupFn = this.derive(isArray ? dependantValues : dependantValues[0]) || noop;
      }
    };

    const unsubscribers = storesArr.map((store, idx) => store.subscribe({
      next: (v) => {
        dependantValues[idx] = v;
        pending &= ~(1 << idx);
        callDerive();
      },
      invalidate: () => {
        pending |= 1 << idx;
      },
    }));

    initDone = true;
    callDerive();
    return () => {
      callCleanup();
      unsubscribers.forEach(callUnsubscribe);
    };
  }

  protected abstract derive(values: SubscribableStoresValues<S>): Unsubscriber|void;
}

export function derived<T, S extends SubscribableStores>(stores: S, deriveFn: SyncDeriveFn<T, S>): Readable<T>;
export function derived<T, S extends SubscribableStores>(
    stores: S, deriveFn: AsyncDeriveFn<T, S>, initialValue: T): Readable<T>;
export function derived<T, S extends SubscribableStores>(
    stores: S, deriveFn: DeriveFn<T, S>, initialValue?: T): Readable<T> {
  const Derived = isSyncDeriveFn(deriveFn) ? class extends DerivedStore<T, S>{
    protected derive(values: SubscribableStoresValues<S>) {
      this.set(deriveFn(values));
    }
  } :
      class extends DerivedStore<T, S>{
        protected derive(values: SubscribableStoresValues<S>) {
          const setFn = (v: T) => this.set(v);
          setFn.set = setFn;
          setFn.update = (updater: Updater<T>) => this.update(updater);
          return deriveFn(values, setFn);
        }
      };
  return asReadable(new Derived(stores, initialValue as any));
}
