import {Injectable, RendererFactory2, OnDestroy} from '@angular/core';

import {isDefined} from './util';



////////////////////////////////////////////////////////////////////////////////
// Types: subscription
////////////////////////////////////////////////////////////////////////////////

export interface CallbackPayload { event: Event; }

export interface SubscriptionSpec {
  keyEvent?: 'keyup' | 'keydown';
  mouseEvent?: 'mouseup' | 'mousedown';

  shouldAutoClose?(): boolean;
  shouldCloseOnEscape?(payload: CallbackPayload): boolean;
  shouldCloseOnClickOutside?(payload: CallbackPayload): boolean;
  shouldCloseOnClickInside?(payload: CallbackPayload): boolean;

  isTargetTogglingElement?(target: HTMLElement): boolean;
  isTargetInside?(target: HTMLElement): boolean;

  close(event: Event, payload: {reason: 'escape' | 'outside_click' | 'inside_click', eventType: string});
}

// For TypeScript 2.8
// export type SubscriptionInstance = {
//   { +readonly [P in keyof SubscriptionSpec]-?: SubscriptionSpec[P] };
// }
export interface SubscriptionInstance {
  readonly keyEvent: SubscriptionSpec['keyEvent'], readonly mouseEvent: SubscriptionSpec['mouseEvent'],

      readonly shouldAutoClose: SubscriptionSpec['shouldAutoClose'],
      readonly shouldCloseOnEscape: SubscriptionSpec['shouldCloseOnEscape'],
      readonly shouldCloseOnClickOutside: SubscriptionSpec['shouldCloseOnClickOutside'],
      readonly shouldCloseOnClickInside: SubscriptionSpec['shouldCloseOnClickInside'],

      readonly isTargetTogglingElement: SubscriptionSpec['isTargetTogglingElement'],
      readonly isTargetInside: SubscriptionSpec['isTargetInside'],

      readonly close: SubscriptionSpec['close']
}

export type SubscriptionToken = Function;



////////////////////////////////////////////////////////////////////////////////
// Types: subscriber
////////////////////////////////////////////////////////////////////////////////

export type Subscriber = {
  (): void; isSubscribed: () => boolean; toggle: () => void; subscribe: () => void; unsubscribe: () => void;
};



////////////////////////////////////////////////////////////////////////////////
// Types: high-level api
////////////////////////////////////////////////////////////////////////////////

export type AutoCloseMode = 'inside' | 'outside';
export type AutoCloseType = boolean | AutoCloseMode;

export interface SubscriptionSpecFactorySpec {
  keyEvent?: SubscriptionSpec['keyEvent'];
  mouseEvent?: SubscriptionSpec['mouseEvent'];
  close: SubscriptionSpec['close'];

  getAutoClose?: () => AutoCloseType;
  getElementsInside?: () => HTMLElement[];
  getTogglingElement?: () => HTMLElement;
}



////////////////////////////////////////////////////////////////////////////////
// Service
////////////////////////////////////////////////////////////////////////////////

@Injectable()
export class AutoCloseService implements OnDestroy {
  ////////////////////////////////////////////////////////////////////////////
  // Events listening
  ////////////////////////////////////////////////////////////////////////////

  private listenersSubscriptions: Function[];

  constructor(rendererFactory: RendererFactory2) {
    const renderer = rendererFactory.createRenderer(null, null);

    this.listenersSubscriptions = [
      ['click', 'onClickEvent'], ['mousedown', 'onMouseEvent'], ['mouseup', 'onMouseEvent'], ['keydown', 'onKeyEvent'],
      ['keyup', 'onKeyEvent']
    ].map(([type, handler]) => renderer.listen('document', type, event => this[handler](event, type)));
  }

  ngOnDestroy() { this.listenersSubscriptions.forEach(subscription => subscription()); }



  ////////////////////////////////////////////////////////////////////////////
  // Subscribing management
  ////////////////////////////////////////////////////////////////////////////

  // tslint:disable-next-line:member-ordering
  private subscriptions: SubscriptionInstance[] = [];

  public subscribe(subscription: SubscriptionInstance): SubscriptionToken {
    const {subscriptions} = this;

    if (!subscriptions.includes(subscription)) {
      subscriptions.unshift(subscription);
    }

    return () => this.unsubscribe(subscription);
  }

  private unsubscribe(subscription: SubscriptionInstance) {
    this.subscriptions = this.subscriptions.filter(item => item !== subscription);
  }

  public createSubscriber(subscriptionSpec: SubscriptionSpec): Subscriber {
    const subscriptionInstance = this.normalizeSubscription(subscriptionSpec);

    let subscriptionToken: SubscriptionToken = null;
    const _isSubscribed = () => isDefined(subscriptionToken);
    const _subscribe = () => subscriptionToken = this.subscribe(subscriptionInstance);
    const _unsubscribe = () => (subscriptionToken(), subscriptionToken = null);
    const _toggle = () => !_isSubscribed() ? _subscribe() : _unsubscribe();

    const subscriber: any = () => _toggle();
    subscriber.toggle = _toggle;
    subscriber.isSubscribed = _isSubscribed;
    subscriber.subscribe = () => !_isSubscribed() && _subscribe();
    subscriber.unsubscribe = () => _isSubscribed() && _unsubscribe();

    return subscriber;
  }



  ////////////////////////////////////////////////////////////////////////////
  // Event handling
  ////////////////////////////////////////////////////////////////////////////

  // tslint:disable-next-line:member-ordering
  private _subscriptionExecuted: boolean;

  // A few notes:
  // - we handle the left click only
  // - the click event comes last among mouse events of a same user action, so:
  //   - it's no time to reset the `_subscriptionExecuted` flag anyways
  //   - there's no need to update this flag at the end since there's no further event
  // - if during a same user action a subscription already got called, we skip processing until next user action
  private onClickEvent(event: MouseEvent, eventType: string) {
    if (event.button !== 0 || this._subscriptionExecuted) {
      return;
    }

    this.arraySome(this.subscriptions, ({shouldAutoClose, shouldCloseOnClickInside, isTargetInside, close}) => {
      // note: if we can't determine if target is inside (i.e. `isTargetInside` is not defined):
      // - we won't call subscriptions here
      // - anyways the subscriptions would have been called in previous mouse events then
      // note: we call filters in an order so that potentially more costly processing occurs less probably
      if (isDefined(isTargetInside) && shouldAutoClose() && shouldCloseOnClickInside({event}) &&
          isTargetInside(<HTMLElement>event.target)) {
        close(event, {reason: 'inside_click', eventType});
        return true;
      }

      return false;
    });
  }

  // A few notes:
  // - we handle the left click only
  // - for one user action, the first mouse event is `mousedown` so it's a good time to reset the
  // `_subscriptionExecuted` flag
  // - if during a same user action a subscription already got called, we skip processing until next user action
  private onMouseEvent(event: MouseEvent, eventType: string) {
    if (event.button !== 0) {
      return;
    }

    if (eventType === 'mousedown') {
      this._subscriptionExecuted = null;
    } else if (this._subscriptionExecuted) {
      return;
    }

    this._subscriptionExecuted =
        this.ensureTrueFlag(this._subscriptionExecuted, this.arraySome(this.subscriptions, subscription => {
          const {mouseEvent, shouldAutoClose, shouldCloseOnClickOutside, isTargetTogglingElement, isTargetInside,
                 close} = subscription;
          const target = <HTMLElement>event.target;

          // note: `shouldCloseOnClickOutside` makes no sense if we can't check if
          // target is inside/outside (i.e. if `isTargetInside` is not defined)
          if (mouseEvent === eventType && shouldAutoClose() && !isTargetTogglingElement(target) &&
              (!isDefined(isTargetInside) || (!isTargetInside(target) && shouldCloseOnClickOutside({event})))) {
            close(event, {reason: 'outside_click', eventType});
            return true;
          }
          return false;
        }));
  }

  // A few notes:
  // - we handle the `escape` key only
  // - for one user action, the first keyboard event is `keydown` so it's a good time to reset the
  // `_subscriptionExecuted` flag
  // - if during a same user action a subscription already got called, we skip processing until next user action
  private onKeyEvent(event: KeyboardEvent, eventType: string) {
    if (!['Escape', 'Esc'].includes(event.key)) {
      return;
    }

    if (eventType === 'keydown') {
      this._subscriptionExecuted = null;
    } else if (this._subscriptionExecuted) {
      return;
    }

    this._subscriptionExecuted = this.ensureTrueFlag(
        this._subscriptionExecuted,
        this.arraySome(this.subscriptions, ({keyEvent, shouldAutoClose, shouldCloseOnEscape, close}) => {
          if (keyEvent === eventType && shouldAutoClose() && shouldCloseOnEscape({event})) {
            close(event, {reason: 'escape', eventType});
            return true;
          }
          return false;
        }));
  }



  ////////////////////////////////////////////////////////////////////////////
  // Subscription implementation
  ////////////////////////////////////////////////////////////////////////////

  private normalizeSubscription(subscriptionSpec: SubscriptionSpec): SubscriptionInstance {
    return {
      keyEvent: this.withDefault(subscriptionSpec.keyEvent, 'keyup'),
      mouseEvent: this.withDefault(subscriptionSpec.mouseEvent, 'mousedown'),

      shouldAutoClose: this.withDefault(subscriptionSpec.shouldAutoClose, () => true),
      shouldCloseOnEscape: this.withDefault(subscriptionSpec.shouldCloseOnEscape, () => true),

      shouldCloseOnClickOutside: this.withDefault(subscriptionSpec.shouldCloseOnClickOutside, () => true),
      shouldCloseOnClickInside: this.withDefault(subscriptionSpec.shouldCloseOnClickInside, () => false),

      isTargetTogglingElement: this.withDefault(subscriptionSpec.isTargetTogglingElement, () => false),
      isTargetInside: subscriptionSpec.isTargetInside,
      close: subscriptionSpec.close
    };
  }

  public subscriptionSpecFactory(arg: SubscriptionSpecFactorySpec): SubscriptionSpec {
    const getAutoClose = this.withDefault(arg.getAutoClose, () => false);

    const autoCloseIsTrueOr = (alternative: AutoCloseMode) => () => {
      const autoClose = getAutoClose();
      return !!(autoClose === true || autoClose === alternative);
    };

    const shouldAutoClose = () => {
      const autoClose = getAutoClose();
      return autoClose === true || autoClose === 'inside' || autoClose === 'outside';
    };

    const {getElementsInside} = arg;
    const isTargetInside = !isDefined(getElementsInside) ?
        () => false :
        target => {
          const elements = getElementsInside();
          return !isDefined(elements) ? false :
                                        this.arraySome(elements, element => this.safeElementContains(element, target));
        }

        const {getTogglingElement} = arg;
    const isTargetTogglingElement = !isDefined(getTogglingElement) ?
        () => false :
        (target: HTMLElement) => this.safeElementContains(getTogglingElement(), target);

    return {
      close: arg.close,
      keyEvent: arg.keyEvent,
      mouseEvent: arg.mouseEvent,

      isTargetInside,
      isTargetTogglingElement,

      shouldAutoClose,
      shouldCloseOnEscape: shouldAutoClose,
      shouldCloseOnClickInside: autoCloseIsTrueOr('inside'),
      shouldCloseOnClickOutside: autoCloseIsTrueOr('outside')
    };
  }



  ////////////////////////////////////////////////////////////////////////////
  // Utilities
  ////////////////////////////////////////////////////////////////////////////

  private ensureTrueFlag(previousValue, newValue) { return previousValue !== true ? newValue : previousValue; }

  private arraySome<T>(array: T[], predicate: (item: T, index: number, array: T[]) => boolean): boolean {
    return array.findIndex(predicate) !== -1;
  }

  private safeElementContains(element?: HTMLElement, descendant?: HTMLElement): boolean {
    return (!isDefined(element) || !isDefined(descendant)) ? false : element.contains(descendant);
  }

  private withDefault<T>(value: T, defaultValue: T): T { return isDefined(value) ? value : defaultValue; }
}
