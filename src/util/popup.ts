import {
	afterNextRender,
	AfterRenderPhase,
	ApplicationRef,
	ComponentRef,
	inject,
	Injector,
	NgZone,
	TemplateRef,
	Type,
	ViewContainerRef,
	ViewRef,
} from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

import { ngbRunTransition } from './transition/ngbTransition';
import { DOCUMENT } from '@angular/common';

export class ContentRef {
	constructor(
		public nodes: Node[][],
		public viewRef?: ViewRef,
		public componentRef?: ComponentRef<any>,
	) {}
}

export class PopupService<T> {
	private _windowRef: ComponentRef<T> | null = null;
	private _contentRef: ContentRef | null = null;

	private _document = inject(DOCUMENT);
	private _applicationRef = inject(ApplicationRef);
	private _injector = inject(Injector);
	private _viewContainerRef = inject(ViewContainerRef);
	private _ngZone = inject(NgZone);

	constructor(private _componentType: Type<T>) {}

	open(
		content?: string | TemplateRef<any>,
		templateContext?: any,
		animation = false,
	): { windowRef: ComponentRef<T>; transition$: Observable<void> } {
		if (!this._windowRef) {
			this._contentRef = this._getContentRef(content, templateContext);
			this._windowRef = this._viewContainerRef.createComponent(this._componentType, {
				injector: this._injector,
				projectableNodes: this._contentRef.nodes,
			});
		}

		const { nativeElement } = this._windowRef.location;

		const nextRenderSubject = new Subject<void>();
		afterNextRender(
			() => {
				nextRenderSubject.next();
				nextRenderSubject.complete();
			},
			{
				injector: this._injector,
				phase: AfterRenderPhase.MixedReadWrite,
			},
		);
		const transition$ = nextRenderSubject.pipe(
			mergeMap(() =>
				ngbRunTransition(this._ngZone, nativeElement, ({ classList }) => classList.add('show'), {
					animation,
					runningTransition: 'continue',
				}),
			),
		);

		return { windowRef: this._windowRef, transition$ };
	}

	close(animation = false): Observable<void> {
		if (!this._windowRef) {
			return of(undefined);
		}

		return ngbRunTransition(
			this._ngZone,
			this._windowRef.location.nativeElement,
			({ classList }) => classList.remove('show'),
			{ animation, runningTransition: 'stop' },
		).pipe(
			tap(() => {
				this._windowRef?.destroy();
				this._contentRef?.viewRef?.destroy();
				this._windowRef = null;
				this._contentRef = null;
			}),
		);
	}

	private _getContentRef(content?: string | TemplateRef<any>, templateContext?: any): ContentRef {
		if (!content) {
			return new ContentRef([]);
		} else if (content instanceof TemplateRef) {
			const viewRef = content.createEmbeddedView(templateContext);
			this._applicationRef.attachView(viewRef);
			return new ContentRef([viewRef.rootNodes], viewRef);
		} else {
			return new ContentRef([[this._document.createTextNode(`${content}`)]]);
		}
	}
}
