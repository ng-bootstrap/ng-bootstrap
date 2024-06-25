import {
	afterRender,
	AfterRenderRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	TemplateRef,
	ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';

import { NgbTooltipConfig } from './tooltip-config';
import { addPopperOffset } from '../util/positioning-util';

let nextId = 0;

@Component({
	selector: 'ngb-tooltip-window',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '"tooltip" + (tooltipClass ? " " + tooltipClass : "")',
		'[class.fade]': 'animation',
		role: 'tooltip',
		'[id]': 'id',
	},
	styleUrl: './tooltip.scss',
	template: `
		<div class="tooltip-arrow" data-popper-arrow></div>
		<div class="tooltip-inner">
			<ng-content />
		</div>
	`,
})
export class NgbTooltipWindow {
	@Input() animation: boolean;
	@Input() id: string;
	@Input() tooltipClass: string;
}

/**
 * A lightweight and extensible directive for fancy tooltip creation.
 */
@Directive({ selector: '[ngbTooltip]', standalone: true, exportAs: 'ngbTooltip' })
export class NgbTooltip implements OnInit, OnDestroy, OnChanges {
	static ngAcceptInputType_autoClose: boolean | string;

	private _config = inject(NgbTooltipConfig);

	/**
	 * If `true`, tooltip opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * Indicates whether the tooltip should be closed on `Escape` key and inside/outside clicks:
	 *
	 * * `true` - closes on both outside and inside clicks as well as `Escape` presses
	 * * `false` - disables the autoClose feature (NB: triggers still apply)
	 * * `"inside"` - closes on inside clicks as well as Escape presses
	 * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
	 * as well as `Escape` presses
	 *
	 * @since 3.0.0
	 */
	@Input() autoClose = this._config.autoClose;

	/**
	 * The preferred placement of the tooltip, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"auto"`.
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the tooltip.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * Specifies events that should trigger the tooltip.
	 *
	 * Supports a space separated list of event names.
	 * For more details see the [triggers demo](#/components/tooltip/examples#triggers).
	 */
	@Input() triggers = this._config.triggers;

	/**
	 * A css selector or html element specifying the element the tooltip should be positioned against.
	 * By default, the element `ngbTooltip` directive is applied to will be set as a target.
	 *
	 * @since 13.1.0
	 */
	@Input() positionTarget?: string | HTMLElement;

	/**
	 * A selector specifying the element the tooltip should be appended to.
	 *
	 * Currently only supports `"body"`.
	 */
	@Input() container = this._config.container;

	/**
	 * If `true`, tooltip is disabled and won't be displayed.
	 *
	 * @since 1.1.0
	 */
	@Input() disableTooltip = this._config.disableTooltip;

	/**
	 * An optional class applied to the tooltip window element.
	 *
	 * @since 3.2.0
	 */
	@Input() tooltipClass = this._config.tooltipClass;

	/**
	 * Default template context for `TemplateRef`, can be overridden with `open` method.
	 *
	 * @since 15.1.0
	 */
	@Input() tooltipContext: any;

	/**
	 * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() openDelay = this._config.openDelay;

	/**
	 * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() closeDelay = this._config.closeDelay;

	/**
	 * An event emitted when the tooltip opening animation has finished. Contains no payload.
	 */
	@Output() shown = new EventEmitter();

	/**
	 * An event emitted when the tooltip closing animation has finished. Contains no payload.
	 */
	@Output() hidden = new EventEmitter();

	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _ngZone = inject(NgZone);
	private _document = inject(DOCUMENT);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _ngbTooltip: string | TemplateRef<any> | null | undefined;
	private _ngbTooltipWindowId = `ngb-tooltip-${nextId++}`;
	private _popupService = new PopupService(NgbTooltipWindow);
	private _windowRef: ComponentRef<NgbTooltipWindow> | null = null;
	private _unregisterListenersFn;
	private _positioning = ngbPositioning();
	private _afterRenderRef: AfterRenderRef | undefined;

	/**
	 * The string content or a `TemplateRef` for the content to be displayed in the tooltip.
	 *
	 * If the content if falsy, the tooltip won't open.
	 */
	@Input()
	set ngbTooltip(value: string | TemplateRef<any> | null | undefined) {
		this._ngbTooltip = value;
		if (!value && this._windowRef) {
			this.close();
		}
	}

	get ngbTooltip() {
		return this._ngbTooltip;
	}

	/**
	 * Opens the tooltip.
	 *
	 * This is considered to be a "manual" triggering.
	 * The `context` is an optional value to be injected into the tooltip template when it is created.
	 */
	open(context?: any) {
		if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
			const { windowRef, transition$ } = this._popupService.open(
				this._ngbTooltip,
				context ?? this.tooltipContext,
				this.animation,
			);
			this._windowRef = windowRef;
			this._windowRef.setInput('animation', this.animation);
			this._windowRef.setInput('tooltipClass', this.tooltipClass);
			this._windowRef.setInput('id', this._ngbTooltipWindowId);

			this._getPositionTargetElement().setAttribute('aria-describedby', this._ngbTooltipWindowId);

			if (this.container === 'body') {
				this._document.body.appendChild(this._windowRef.location.nativeElement);
			}

			// We need to detect changes, because we don't know where .open() might be called from.
			// Ex. opening tooltip from one of lifecycle hooks that run after the CD
			// (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
			this._windowRef.changeDetectorRef.detectChanges();

			// We need to mark for check, because tooltip won't work inside the OnPush component.
			// Ex. when we use expression like `{{ tooltip.isOpen() : 'opened' : 'closed' }}`
			// inside the template of an OnPush component and we change the tooltip from
			// open -> closed, the expression in question won't be updated unless we explicitly
			// mark the parent component to be checked.
			this._windowRef.changeDetectorRef.markForCheck();

			// Setting up popper and scheduling updates when zone is stable
			this._ngZone.runOutsideAngular(() => {
				this._positioning.createPopper({
					hostElement: this._getPositionTargetElement(),
					targetElement: this._windowRef!.location.nativeElement,
					placement: this.placement,
					baseClass: 'bs-tooltip',
					updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 6])(options)),
				});

				Promise.resolve().then(() => {
					// This update is required for correct arrow placement
					this._positioning.update();
				});
				this._afterRenderRef = afterRender(
					{
						mixedReadWrite: () => {
							this._positioning.update();
						},
					},
					{ injector: this._injector },
				);
			});

			ngbAutoClose(
				this._ngZone,
				this._document,
				this.autoClose,
				() => this.close(),
				this.hidden,
				[this._windowRef.location.nativeElement],
				[this._nativeElement],
			);

			transition$.subscribe(() => this.shown.emit());
		}
	}

	/**
	 * Closes the tooltip.
	 *
	 * This is considered to be a "manual" triggering of the tooltip.
	 */
	close(animation = this.animation): void {
		if (this._windowRef != null) {
			this._getPositionTargetElement().removeAttribute('aria-describedby');
			this._popupService.close(animation).subscribe(() => {
				this._windowRef = null;
				this._positioning.destroy();
				this._afterRenderRef?.destroy();
				this.hidden.emit();
				this._changeDetector.markForCheck();
			});
		}
	}

	/**
	 * Toggles the tooltip.
	 *
	 * This is considered to be a "manual" triggering of the tooltip.
	 */
	toggle(): void {
		if (this._windowRef) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * Returns `true`, if the tooltip is currently shown.
	 */
	isOpen(): boolean {
		return this._windowRef != null;
	}

	ngOnInit() {
		this._unregisterListenersFn = listenToTriggers(
			this._nativeElement,
			this.triggers,
			this.isOpen.bind(this),
			this.open.bind(this),
			this.close.bind(this),
			+this.openDelay,
			+this.closeDelay,
		);
	}

	ngOnChanges({ tooltipClass }: SimpleChanges) {
		if (tooltipClass && this.isOpen()) {
			this._windowRef!.setInput('tooltipClass', tooltipClass.currentValue);
		}
	}

	ngOnDestroy() {
		this.close(false);
		// This check is necessary because it's possible that ngOnDestroy could be invoked before ngOnInit.
		// under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
		this._unregisterListenersFn?.();
	}

	private _getPositionTargetElement(): HTMLElement {
		return (
			(isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
			this._nativeElement
		);
	}
}
