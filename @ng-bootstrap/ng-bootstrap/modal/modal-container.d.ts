import { Injector, Renderer, TemplateRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NgbModalStack } from './modal-stack';
import { NgbModalRef } from './modal-ref';
export declare class NgbModalContainer {
    private _injector;
    private _renderer;
    private _viewContainerRef;
    private _componentFactoryResolver;
    private _backdropFactory;
    private _windowFactory;
    constructor(_injector: Injector, _renderer: Renderer, _viewContainerRef: ViewContainerRef, _componentFactoryResolver: ComponentFactoryResolver, ngbModalStack: NgbModalStack);
    open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: string | TemplateRef<any>, options: any): NgbModalRef;
    private _applyWindowOptions(windowInstance, options);
    private _getContentRef(moduleCFR, contentInjector, content, context);
}
