Autoclose service documentation

----





# Motivation

Many widgets share a common trait: their content are displayed in a popup and this popup can be closed on some events.

Therefore the goal of this service is to have a single piece of code taking care of this logic, hiding all technical details, in order to both: 

- reduce the (duplicated) code inside each widget
- have a common, consistent behavior





# Getting started

Basic scenario: 

- inject the service into your class
- using this service: create a subscriber with a proper spec and store it as an instance variable
- using this subscriber: subscribe to the events when you open the dropdown you want to control
- using the subscriber: unsubscribe from the events when closing the dropdown (on a close method and/or on destroy)

The subscription spec provides some static and some dynamic filters to determine if the popup should be closed or not when some events occur.

The service handles two kind of events: 

- the <kbd>escape</kbd> key, on either `keydown` or `keyup` (defaults to `keyup`)
- the left-click mouse events, on either `mousedown` or `mouseup` (defaults to `mousedown`) when clicking outside the popup and `click` when clicking inside (see below for details)

In addition to filtering the events, the service checks the mode of the widget (should auto close or not, when clicking inside or not, when clicking outside or not, etc.) and then depending on the mode will choose whether to process or not using the event's target.

At the lowest level, a subscriber spec looks like that: 

- `close`: will eventually be called if all filters have passed; should implement the closing of the popup
- `keyEvent`: listen to <kbd>escape</kbd> either on `keydown` or `keyup`
- `mouseEvent`: listen to left-click either on `mousedown` or `mouseup`
- `shouldAutoClose`: return `false` to deactivate auto closing, `true` to activate it; subsequent filters will then be called to determine if it should actually be closed or not
- `shouldCloseOnEscape`: return `true` if you want so
- `shouldCloseOnClickOutside`: return `true` is you want so; _outside_ elements usually means everything out of the popup
- `shouldCloseOnClickInside`: return `true` is you want so; _inside_ elements usually means everything in the popup
- `isTargetInside`: return `true` if you consider the given element is inside the popup, `false` otherwise
- `isTargetTogglingElement`: return `true` if you consider the given element is the toggling element (in this case we leave the closing to you to prevent the close-then-reopen effect), `false` otherwise

While this gives you great flexibility (and you can adapt the semantics to your specific needs), there is a common pattern which emerged and would lead to repeating the same code again and again. Therefore, we provide a facility to create such a structure above, but from a higher level one: 

- forwarded properties: `keyEvent`, `mouseEvent`, `close`; pass them as you would do above
- `getAutoClose`: return `false` to deactivate auto closing, `true` to activate it in all situations, otherwise `'inside'` for closing only when clicking inside the popup, and `'outside'` for when it's outside
- `getElementsInside`: return a list of elements that are considered to be inside the popup (they'll be checked with `element.contains(target)`). If you don't provide it, or return `null`, the target will never be considered to be inside the popup.
- `getTogglingElement`: return the element that is considered as the toggling element (it will be checked with `element.contains(target)`. If you don't provide it, we will consider there is no toggling element.

## Examples

### High-level

```typescript
import {Injectable, OnDestroy, Input} from '@angular/core';

import {AutoCloseService, Subscriber, AutoCloseType} from '.../autoclose.service';

@Injectable()
class MyWidget implements OnDestroy {
	private _autoCloseSubscriber: Subscriber;
	@Input() autoClose: AutoCloseType;

	constructor(autoCloseService: AutoCloseService) {
		this._autoCloseSubscriber = autoCloseService.createSubscriber(autoCloseService.subscriptionSpecFactory({
			getAutoClose: () => this.autoClose,
			getElementsInside: () => [this._popup],
			getTogglingElement: () => this._toggleButton,
			close: () => this.close()
	  }));
	}
	
	ngOnDestroy() {
		// ...
		this._autoCloseSubscriber.unsubscribe();
		// ...
	}
	
	open() {
		// ...
		this._autoCloseSubscriber.subscribe();
		// ...
	}
	
	close() {
		// ...
		this._autoCloseSubscriber.unsubscribe();
		// ...
	}
}
```

### Low-level

In this example, we consider the popup to be surrounded by an overlay: 

- when pressing <kbd>escape</kbd>, we should close
- when clicking on the overlay, we should close
- when clicking inside the popup or outside (except the overlay), we should not close
- physically, the popup is inside the overlay, but there is no intermediate element between the two (direct parent-child relationship)
- there is a possibility to disable the overlay

So we adapt the semantics to: 

- consider that the overlay exclusively is _the inside_
- the rest is _the outside_ (including the popup)

```typescript
import {Injectable, OnDestroy, Input} from '@angular/core';

import {AutoCloseService, Subscriber} from '.../autoclose.service';

@Injectable()
class MyWidget implements OnDestroy {
	private _autoCloseSubscriber: Subscriber;

	constructor(autoCloseService: AutoCloseService) {
		this._autoCloseSubscriber = autoCloseService.createSubscriber(autoCloseService.subscriptionSpecFactory({
			shouldAutoClose: () => true,
			isTargetInside: (target) => target === this._overlay,
			shouldCloseOnEscape: () => true,
			shouldCloseOnClickOutside: () => false,
			shouldCloseOnClickInside: () => this._overlay != null,
			close: () => this.close()
	  }));
	}
	
	ngOnDestroy() {
		// ...
		this._autoCloseSubscriber.unsubscribe();
		// ...
	}
	
	open() {
		// ...
		this._autoCloseSubscriber.subscribe();
		// ...
	}
	
	close() {
		// ...
		this._autoCloseSubscriber.unsubscribe();
		// ...
	}
}
```





# API

## Types

### Subscription

- `SubscriptionSpec`: the description of a subscription, used to subscribe
	- static filters
		- `keyEvent`: the key event type upon which to react
		- `mouseEvent`: the mouse event type upon which to react

	- dynamic filters
		- `shouldAutoClose`: a global first check, tells if the widget is in auto close mode (this is not sufficient to return `true` here to make it close, see below)
		- `shouldCloseOnEscape`: tells whether the widget should close when <kbd>escape</kbd> has been pressed
		- `shouldCloseOnClickOutside`: tells whether the widget should close when a proper mouse event occurred in a zone which is outside (determined thanks to `isTargetInside`, see below)
		- `shouldCloseOnClickInside`: tells whether the widget should close when a proper mouse event occurred in a zone which is inside (determined thanks to `isTargetInside`, see below)
	- event's target location checking
		- `isTargetTogglingElement`: tells whether it is considered to be on the element used to toggle the popup (if true, we don't close, since it's the responsibility of this element to do so and it would conflict with it)
		- `isTargetInside`: tells whether it is considered to be inside the popup
	- implementation
		- `close`: callback used to close the widget
- `CallbackPayload`: the object passed to callbacks used to check if the content should be closed or not (see `SubscriptionSpec`)
	- `event`: the DOM event upon which the check occurs, so you can inspect it or interact with it
- `Subscription`: what is returned when subscribing; it is a function used to unsubscribe, it's a facilitation 

### Facilitation

- usually widgets have an input property used to tell if auto close should be on or not, and if so in which mode
	- `AutoCloseMode`: if this property is of this type, auto close is on but only for all <kbd>escape</kbd> events and for mouse events occurring either `inside` or `outside` as determined by the given value
	- `AutoCloseType`: otherwise the property can be __either__ of type `AutoCloseMode` or a simple boolean, in which case a value of `false` turns off the feature while `trues` turns it on
- `SubscriptionSpecFactorySpec`: a simplified, higher-level subscription spec, used to generate a lower level one; the goal is to avoid writing the same code multiple times for similar use cases
	- delegated properties: 
	    - `keyEvent`
	    - `mouseEvent`
	    - `close`
    - fetch information: 
      - `getAutoClose`: gets the auto close property value, as described above (of type `AutoCloseType`): generates `shouldAutoClose`, `shouldCloseOnEscape` and is used by generated `shouldCloseOnClickOutside` and `shouldCloseOnClickInside`
      - `getElementsInside`: gets the list of elements to be considered as to be inside the popup; generates `isTargetInside`
      - `getTogglingElement`: gets the element to be considered as to be the toggling element; generates `isTargetTogglingElement`; if not provided, it is considered there is no toggling element
- `Subscriber`: wraps a subscription spec and provides utilities to subscribe, unsubscribe, toggle the subscription, all of that using the same subscription spec and with proper state checking (to avoid subscribing multiple times and so on)
	- `toggle`: toggles the subscription on and off
	- the returned object itself is actually a function calling this `toggle`
  - `subscribe`: registers the subscription
  - `unsubscribe`: removes the subscription

## Service

### Low level

- `subscribe(subscriptionSpec)`: registers the given subscription, putting it first and returns a function to easily unsubscribe
- `unsubscribe(subscriptionSpec)`: removes given subscription
- `createSubscriber(subscriptionSpec)`: creates and returns a `Subscriber` from given `SubscriptionSpec`

### Facilitation

- `subscriptionSpecFactory(subscriptionSpecFactorySpec)`: creates a `SubscriptionSpec` from a `SubscriptionSpecFactorySpec`
- `isTargetTogglingElementFactory(getTogglingElement)`: creates a `isTargetTogglingElement` function from one which gets the toggling element
- `isTargetInsideFactory(getElementsInside)`: creates a `isTargetTogglingElement` function from one which gets the list of elements inside
- `shouldCloseFactory(getAutoClose)`: creates `shouldClose`, `shouldCloseOnEscape`, `shouldCloseOnClickOutside`, `shouldCloseOnClickInside` functions from one which returns the auto close value of type `AutoCloseType`

### Utilities

They are generic and would have their place somewhere else.

- `arraySome(array, predicate)`: returns `true` if at least one element from the given array satisfies the given predicate, `false` otherwise
- `safeElementContains(element, descendant)`: returns `false` if any of the two given elements are not defined, otherwise uses the DOM method `element.contains(descendant)`





# Internals

## DOM events listening

All potentially used events are listened to when creating the instance of the service, and the listeners are removed on destroy. Here is the list of events: 

- `click`, handled by `onClickEvent`
- `mousedown`, handled by `onMouseEvent`
- `mouseup`, handled by `onMouseEvent`
- `keydown`, handled by `onKeyEvent`
- `keyup`, handled by `onKeyEvent`

When one of these events is triggered, then the filtering occurs (global one and per subscription). So it needs to be efficient.

There is room for optimization, like for instance listening only if strictly necessary, but this must be done with great care since the events handling (see below) for now relies on listening to all of these events.

## Subscriptions management

Subscriptions specs are stored as is, the object passed by the user is not replaced nor modified, it is used as an id for the subscription. Therefore it is important the users keep them, or use the subscriber utility, which does that for them.

This also means that default values are not computed once and for all, and the spec could be changed dynamically (by mutating the object) to alter the whole behavior. However this is an unlikely use case, since this would mean the nature of the widget using this utility changes itself.

There is room for optimization, for instance by considering the spec as immutable we could optimize the default values. But in this case, if users want to change the spec — again, this is very unlikely — we should provide a way to replace it.

Regarding the data structure used to store the subscriptions, it is the equivalent of a stack. It is very important to process the subscriptions in the reverse order of their registration, because we stop processing subscriptions for a given user action when one subscription has been called. By processing in this order, we can handle the case of nested popups, where the innermost popups are registered last, and processed first. So for instance an opened dropdown inside a modal dialog will be closed on first <kbd>escape</kbd> press, and the modal will be closed on the second <kbd>escape</kbd> only.

## Events handling: subscriptions calls

Upon every listened events, checks are done: 

- global checks, not related to any subscribers; to listen to __<kbd>escape</kbd>__ key events only, __left-click__ mouse events only, etc.
- checks per subscriptions

This is described in the user documentation therefore no need to tell more about it here.

There is a technical aspect to be described though: the processing of a __single user action__. A single user action triggers a sequence of events, usually of the same type. Therefore, our check routine will be called upon every of those events. However we want to handle all of these events as a whole — as one single user action — for this sole requirement described previously: stop processing more subscribers when one has already been called.

For that, luckily our class is a singleton and there can be only one single user action at a time: this way we can store an internal state to check what has been done during the handling of previous events for a same user action.

So we reset the state when handling the first event of the sequence (for instance `mousedown` for mouse events), and at the end of each handler we store the state, which in our case just tells whether a subscription has already been called or not. This state can then be checked to skip the subscriptions checking for subsequent events part of the same user action.
