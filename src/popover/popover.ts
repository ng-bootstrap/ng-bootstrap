import {
	afterRender,
	AfterRenderPhase,
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
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';

import { listenToTriggers } from '../util/triggers';
import { ngbAutoClose } from '../util/autoclose';
import { ngbPositioning } from '../util/positioning';
import { PopupService } from '../util/popup';
import { isString } from '../util/util';

import { NgbPopoverConfig } from './popover-config';

import { addPopperOffset } from '../util/positioning-util';

let nextId = 0;

@Component({
    selector: 'ngb-popover-window',
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class]': '"popover" + (popoverClass ? " " + popoverClass : "")',
        '[class.fade]': 'animation',
        role: 'tooltip',
        '[id]': 'id',
        style: 'position: absolute;',
    },
    template: `
		<div class="popover-arrow" data-popper-arrow></div>
		@if (title) {
			<h3 class="popover-header">
				<ng-template #simpleTitle>{{ title }}</ng-template>
				<ng-template
					[ngTemplateOutlet]="isTitleTemplate() ? $any(title) : simpleTitle"
					[ngTemplateOutletContext]="context"
				/>
			</h3>
		}
		<div class="popover-body">
			<ng-content />
		</div>
	`
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

	private _config = inject(NgbPopoverConfig);

	/**
	 * If `true`, popover opening and closing will be animated.
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

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
	@Input() autoClose = this._config.autoClose;

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
	@Input() placement = this._config.placement;

	/**
	 * Allows to change default Popper options when positioning the popover.
	 * Receives current popper options and returns modified ones.
	 *
	 * @since 13.1.0
	 */
	@Input() popperOptions = this._config.popperOptions;

	/**
	 * Specifies events that should trigger the tooltip.
	 *
	 * Supports a space separated list of event names.
	 * For more details see the [triggers demo](#/components/popover/examples#triggers).
	 */
	@Input() triggers = this._config.triggers;

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
	@Input() container = this._config.container;

	/**
	 * If `true`, popover is disabled and won't be displayed.
	 *
	 * @since 1.1.0
	 */
	@Input() disablePopover = this._config.disablePopover;

	/**
	 * An optional class applied to the popover window element.
	 *
	 * @since 2.2.0
	 */
	@Input() popoverClass = this._config.popoverClass;

	/**
	 * Default template context for `TemplateRef`, can be overridden with `open` method.
	 *
	 * @since 15.1.0
	 */
	@Input() popoverContext: any;

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
	 * An event emitted when the popover opening animation has finished. Contains no payload.
	 */
	@Output() shown = new EventEmitter<void>();

	/**
	 * An event emitted when the popover closing animation has finished. Contains no payload.
	 *
	 * At this point popover is not in the DOM anymore.
	 */
	@Output() hidden = new EventEmitter<void>();

	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _ngZone = inject(NgZone);
	private _document = inject(DOCUMENT);
	private _changeDetector = inject(ChangeDetectorRef);
	private _injector = inject(Injector);

	private _ngbPopoverWindowId = `ngb-popover-${nextId++}`;
	private _popupService = new PopupService(NgbPopoverWindow);
	private _windowRef: ComponentRef<NgbPopoverWindow> | null = null;
	private _unregisterListenersFn;
	private _positioning = ngbPositioning();
	private _afterRenderRef: AfterRenderRef;

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
				context ?? this.popoverContext,
				this.animation,
			);
			this._windowRef = windowRef;
			this._windowRef.setInput('animation', this.animation);
			this._windowRef.setInput('title', this.popoverTitle);
			this._windowRef.setInput('context', context ?? this.popoverContext);
			this._windowRef.setInput('popoverClass', this.popoverClass);
			this._windowRef.setInput('id', this._ngbPopoverWindowId);

			this._getPositionTargetElement().setAttribute('aria-describedby', this._ngbPopoverWindowId);

			if (this.container === 'body') {
				this._document.body.appendChild(this._windowRef.location.nativeElement);
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
					baseClass: 'bs-popover',
					updatePopperOptions: (options) => this.popperOptions(addPopperOffset([0, 8])(options)),
				});

				Promise.resolve().then(() => {
					// This update is required for correct arrow placement
					this._positioning.update();
				});
				this._afterRenderRef = afterRender(
					() => {
						this._positioning.update();
					},
					{ phase: AfterRenderPhase.MixedReadWrite, injector: this._injector },
				);
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
			this._nativeElement,
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
			this._windowRef!.setInput('popoverClass', popoverClass.currentValue);
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

	private _isDisabled(): boolean {
		return this.disablePopover ? true : !this.ngbPopover && !this.popoverTitle;
	}

	private _getPositionTargetElement(): HTMLElement {
		return (
			(isString(this.positionTarget) ? this._document.querySelector(this.positionTarget) : this.positionTarget) ||
			this._nativeElement
		);
	}
}
