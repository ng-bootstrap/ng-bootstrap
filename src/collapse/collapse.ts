import { Directive, ElementRef, EventEmitter, inject, Input, NgZone, OnInit, Output } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import { NgbCollapseConfig } from './collapse-config';

/**
 * A directive to provide a simple way of hiding and showing elements on the
 * page.
 */
@Directive({
	selector: '[ngbCollapse]',
	exportAs: 'ngbCollapse',
	host: {
		'[class.collapse-horizontal]': 'horizontal',
	},
})
export class NgbCollapse implements OnInit {
	private _config = inject(NgbCollapseConfig);
	private _element = inject(ElementRef);
	private _zone = inject(NgZone);

	/**
	 * If `true`, collapse will be animated.
	 *
	 * Animation is triggered only when clicked on triggering element
	 * or via the `.toggle()` function
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * Flag used to track if the collapse setter is invoked during initialization
	 * or not. This distinction is made in order to avoid running the transition during initialization.
	 */
	private _afterInit = false;

	private _isCollapsed = false;

	/**
	 * If `true`, will collapse the element or show it otherwise.
	 */
	@Input('ngbCollapse')
	set collapsed(isCollapsed: boolean) {
		if (this._isCollapsed !== isCollapsed) {
			this._isCollapsed = isCollapsed;
			if (this._afterInit) {
				this._runTransitionWithEvents(isCollapsed, this.animation);
			}
		}
	}

	@Output() ngbCollapseChange = new EventEmitter<boolean>();

	/**
	 * If `true`, will collapse horizontally.
	 *
	 * @since 13.1.0
	 */
	@Input() horizontal = this._config.horizontal;

	/**
	 * An event emitted when the collapse element is shown, after the transition.
	 * It has no payload.
	 *
	 * @since 8.0.0
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * An event emitted when the collapse element is hidden, after the transition.
	 * It has no payload.
	 *
	 * @since 8.0.0
	 */
	@Output() hidden = new EventEmitter<void>();

	ngOnInit() {
		this._runTransition(this._isCollapsed, false);
		this._afterInit = true;
	}

	/**
	 * Triggers collapsing programmatically.
	 *
	 * If there is a collapsing transition running already, it will be reversed.
	 * If the animations are turned off this happens synchronously.
	 *
	 * @since 8.0.0
	 */
	toggle(open: boolean = this._isCollapsed) {
		this.collapsed = !open;
		this.ngbCollapseChange.next(this._isCollapsed);
	}

	private _runTransition(collapsed: boolean, animation: boolean) {
		return ngbRunTransition(this._zone, this._element.nativeElement, ngbCollapsingTransition, {
			animation,
			runningTransition: 'stop',
			context: { direction: collapsed ? 'hide' : 'show', dimension: this.horizontal ? 'width' : 'height' },
		});
	}

	private _runTransitionWithEvents(collapsed: boolean, animation: boolean) {
		this._runTransition(collapsed, animation).subscribe(() => {
			if (collapsed) {
				this.hidden.emit();
			} else {
				this.shown.emit();
			}
		});
	}
}
