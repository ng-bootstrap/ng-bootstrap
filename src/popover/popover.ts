import {
	ApplicationRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ComponentRef,
	Directive,
	ElementRef,
	EventEmitter,
	Inject,
	Injector,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
	ViewEncapsulation,
} from '@angular/core';
import { DOCUMENT, NgIf, NgTemplateOutlet } from '@angular/common';

import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning, PlacementArray } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';

import { NgbPopoverConfig } from './popover-config';
import { Options } from '@popperjs/core';

import { addPopperOffset } from '../util/positioning-util';
import { Subscription } from 'rxjs';

let nextId = 0;

@Component({
	selector: 'ngb-popover-window',
	standalone: true,
	imports: [NgTemplateOutlet, NgIf],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class]': '"popover" + (popoverClass ? " " + popoverClass : "")',
		'[class.fade]': 'animation',
		role: 'tooltip',
		'[id]': 'id',
	},
	template: ` <div class="popover-arrow" data-popper-arrow></div>
		<h3 class="popover-header" *ngIf="title">
			<ng-template #simpleTitle>{{ title }}</ng-template>
			<ng-template
				[ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle"
				[ngTemplateOutletContext]="context"
			></ng-template>
		</h3>
		<div class="popover-body"><ng-content></ng-content></div>`,
})
export class NgbPopoverWindow {
	@Input() animation: boolean;
	@Input() title: string | TemplateRef<any> | null | undefined;
	@Input() id: string;
	@Input() popoverClass: string;
	@Input() context: any;

	isTitleTemplate() {
		return this.title instanceof TemplateRef;
	}
}

/**
 * A lightweight and extensible directive for fancy popover creation.
 */
@Directive({ selector: '[ngbPopover]', exportAs: 'ngbPopover', standalone: true })
export class NgbPopover implements OnInit, OnDestroy, OnChanges {
	static ngAcceptInputType_autoClose: boolean | string;

	/**
	 * If `true`, popover opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	@Input() animation: boolean;

	/**
	 * Indicates whether the popover should be closed on `Escape` key and inside/outside clicks:
	 *
	 * * `true` - closes on both outside and inside clicks as well as `Escape` presses
	 * * `false` - disables the autoClose feature (NB: triggers still apply)
	 * * `"inside"` - closes on inside clicks as well as Escape presses
	 * * `"outside"` - closes on outside clicks (sometimes also achievable through triggers)
	 * as well as `Escape` presses
	 *
	 * @since 3.0.0
	 */
	@Input() autoClose: boolean | 'inside' | 'outside';

	/**
	 * The string content or a `TemplateRef` for the content to be displayed in the popover.
	 *
	 * If the title and the content are falsy, the popover won't open.
	 */
	@Input() ngbPopover: string | TemplateRef<any> | null | undefined;

	/**
	 * The title of the popover.
	 *
	 * If the title and the content are falsy, the popover won't open.
	 */
	@Input() popoverTitle: string | TemplateRef<any> | null | undefined;

	/**
	 * The preferred placement of the popover, among the [possible values](#/guides/positioning#api).
	 *
	 * The default order of preference is `"auto"`.
	 *
	 * Please see the [positioning overview](#/positioning) for more details.
	 */
	@Input() placement: PlacementArray;

	/**
	 * Allows to change default Popper options when positioning the popover.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions: (options: Partial<Options>) => Partial<Options>;

	/**
	 * Specifies events that should trigger the tooltip.
	 *
	 * Supports a space separated list of event names.
	 * For more details see the [triggers demo](#/components/popover/examples#triggers).
	 */
	@Input() triggers: string;

	/**
	 * A css selector or html element specifying the element the popover should be positioned against.
	 * By default, the element `ngbPopover` directive is applied to will be set as a target.
	 *
	 * @since 13.1.0
	 */
	@Input() positionTarget?: string | HTMLElement;

	/**
	 * A selector specifying the element the popover should be appended to.
	 *
	 * Currently only supports `body`.
	 */
	@Input() container: string;

	/**
	 * If `true`, popover is disabled and won't be displayed.
	 *
	 * @since 1.1.0
	 */
	@Input() disablePopover: boolean;

	/**
	 * An optional class applied to the popover window element.
	 *
	 * @since 2.2.0
	 */
	@Input() popoverClass: string;

	/**
	 * The opening delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() openDelay: number;

	/**
	 * The closing delay in ms. Works only for "non-manual" opening triggers defined by the `triggers` input.
	 *
	 * @since 4.1.0
	 */
	@Input() closeDelay: number;

	/**
	 * An event emitted when the popover opening animation has finished. Contains no payload.
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * An event emitted when the popover closing animation has finished. Contains no payload.
	 *
	 * At this point popover is not in the DOM anymore.
	 */
	@Output() hidden = new EventEmitter<void>();

	private _ngbPopoverWindowId = `ngb-popover-${nextId++}`;
	private _popupService: PopupService<NgbPopoverWindow>;
	private _windowRef: ComponentRef<NgbPopoverWindow> | null = null;
	private _unregisterListenersFn;
	private _positioning: ReturnType<typeof ngbPositioning>;
	private _zoneSubscription: Subscription;
	private _isDisabled(): boolean {
		if (this.disablePopover) {
			return true;
		}
		if (!this.ngbPopover && !this.popoverTitle) {
			return true;
		}
		return false;
	}

	constructor(
		private _elementRef: ElementRef<HTMLElement>,
		private _renderer: Renderer2,
		injector: Injector,
		viewContainerRef: ViewContainerRef,
		config: NgbPopoverConfig,
		private _ngZone: NgZone,
		@Inject(DOCUMENT) private _document: any,
		private _changeDetector: ChangeDetectorRef,
		applicationRef: ApplicationRef,
	) {
		this.animation = config.animation;
		this.autoClose = config.autoClose;
		this.placement = config.placement;
		this.popperOptions = config.popperOptions;
		this.triggers = config.triggers;
		this.container = config.container;
		this.disablePopover = config.disablePopover;
		this.popoverClass = config.popoverClass;
		this.openDelay = config.openDelay;
		this.closeDelay = config.closeDelay;
		this._positioning = ngbPositioning();
		this._popupService = new PopupService<NgbPopoverWindow>(
			NgbPopoverWindow,
			injector,
			viewContainerRef,
			_renderer,
			this._ngZone,
			applicationRef,
		);
	}

	/**
	 * Opens the popover.
	 *
	 * This is considered to be a "manual" triggering.
	 * The `context` is an optional value to be injected into the popover template when it is created.
	 */
	open(context?: any) {
		if (!this._windowRef && !this._isDisabled()) {
			// this type assertion is safe because otherwise _isDisabled would return true
			const { windowRef, transition$ } = this._popupService.open(
				this.ngbPopover as string | TemplateRef<any>,
				context,
				this.animation,
			);
			this._windowRef = windowRef;
			this._windowRef.setInput('animation', this.animation);
			this._windowRef.setInput('title', this.popoverTitle);
			this._windowRef.setInput('context', context);
			this._windowRef.setInput('popoverClass', this.popoverClass);
			this._windowRef.setInput('id', this._ngbPopoverWindowId);

			this._renderer.setAttribute(this._getPositionTargetElement(), 'aria-describedby', this._ngbPopoverWindowId);

			if (this.container === 'body') {
				this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
			}

			// We need to detect changes, because we don't know where .open() might be called from.
			// Ex. opening popover from one of lifecycle hooks that run after the CD
			// (say from ngAfterViewInit) will result in 'ExpressionHasChanged' exception
			this._windowRef.changeDetectorRef.detectChanges();

			// We need to mark for check, because popover won't work inside the OnPush component.
			// Ex. when we use expression like `{{ popover.isOpen() : 'opened' : 'closed' }}`
			// inside the template of an OnPush component and we change the popover from
			// open -> closed, the expression in question won't be updated unless we explicitly
			// mark the parent component to be checked.
			this._windowRef.changeDetectorRef.markForCheck();

			// Setting up popper and scheduling updates when zone is stable
			this._ngZone.runOutsideAngular(() => {
				this._positioning.createPopper({
					hostElement: this._getPositionTargetElement(),
					targetElement: this._windowRef!.location.nativeElement,
					placement: this.placement,
					appendToBody: this.container === 'body',
					baseClass: 'bs-popover',
					updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 8])(options)),
				});

				Promise.resolve().then(() => {
					// This update is required for correct arrow placement
					this._positioning.update();
					this._zoneSubscription = this._ngZone.onStable.subscribe(() => this._positioning.update());
				});
			});

			ngbAutoClose(this._ngZone, this._document, this.autoClose, () => this.close(), this.hidden, [
				this._windowRef.location.nativeElement,
			]);

			transition$.subscribe(() => this.shown.emit());
		}
	}

	/**
	 * Closes the popover.
	 *
	 * This is considered to be a "manual" triggering of the popover.
	 */
	close(animation = this.animation) {
		if (this._windowRef) {
			this._renderer.removeAttribute(this._getPositionTargetElement(), 'aria-describedby');
			this._popupService.close(animation).subscribe(() => {
				this._windowRef = null;
				this._positioning.destroy();
				this._zoneSubscription?.unsubscribe();
				this.hidden.emit();
				this._changeDetector.markForCheck();
			});
		}
	}

	/**
	 * Toggles the popover.
	 *
	 * This is considered to be a "manual" triggering of the popover.
	 */
	toggle(): void {
		if (this._windowRef) {
			this.close();
		} else {
			this.open();
		}
	}

	/**
	 * Returns `true`, if the popover is currently shown.
	 */
	isOpen(): boolean {
		return this._windowRef != null;
	}

	ngOnInit() {
		this._unregisterListenersFn = listenToTriggers(
			this._renderer,
			this._elementRef.nativeElement,
			this.triggers,
			this.isOpen.bind(this),
			this.open.bind(this),
			this.close.bind(this),
			+this.openDelay,
			+this.closeDelay,
		);
	}

	ngOnChanges({ ngbPopover, popoverTitle, disablePopover, popoverClass }: SimpleChanges) {
		if (popoverClass && this.isOpen()) {
			this._windowRef!.instance.popoverClass = popoverClass.currentValue;
		}
		// close popover if title and content become empty, or disablePopover set to true
		if ((ngbPopover || popoverTitle || disablePopover) && this._isDisabled()) {
			this.close();
		}
	}

	ngOnDestroy() {
		this.close(false);
		// This check is needed as it might happen that ngOnDestroy is called before ngOnInit
		// under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
		this._unregisterListenersFn?.();
	}

	private _getPositionTargetElement(): HTMLElement {
		return (
			(isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
			this._elementRef.nativeElement
		);
	}
}
