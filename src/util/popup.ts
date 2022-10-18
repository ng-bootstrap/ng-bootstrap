import {
	ApplicationRef,
	ComponentRef,
	Injector,
	NgZone,
	Renderer2,
	TemplateRef,
	Type,
	ViewContainerRef,
	ViewRef,
} from '@angular/core';

import { Observable, of } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';

import { ngbRunTransition } from './transition/ngbTransition';

export class ContentRef {
	constructor(public nodes: Node[][], public viewRef?: ViewRef, public componentRef?: ComponentRef<any>) {}
}

export class PopupService<T> {
	private _windowRef: ComponentRef<T> | null = null;
	private _contentRef: ContentRef | null = null;

	constructor(
		private _componentType: Type<any>,
		private _injector: Injector,
		private _viewContainerRef: ViewContainerRef,
		private _renderer: Renderer2,
		private _ngZone: NgZone,
		private _applicationRef: ApplicationRef,
	) {}

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
		const transition$ = this._ngZone.onStable.pipe(
			take(1),
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
				if (this._windowRef) {
					// this is required because of the container='body' option
					this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
					this._windowRef = null;
				}
				if (this._contentRef?.viewRef) {
					this._applicationRef.detachView(this._contentRef.viewRef);
					this._contentRef.viewRef.destroy();
					this._contentRef = null;
				}
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
			return new ContentRef([[this._renderer.createText(`${content}`)]]);
		}
	}
}
