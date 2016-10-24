import { Injector, TemplateRef, ViewRef, ViewContainerRef, Renderer, ComponentRef, ComponentFactoryResolver } from '@angular/core';
export declare class ContentRef {
    nodes: any[];
    viewRef: ViewRef;
    componentRef: ComponentRef<any>;
    constructor(nodes: any[], viewRef?: ViewRef, componentRef?: ComponentRef<any>);
}
export declare class PopupService<T> {
    private _injector;
    private _viewContainerRef;
    private _renderer;
    private _windowFactory;
    private _windowRef;
    private _contentRef;
    constructor(type: any, _injector: Injector, _viewContainerRef: ViewContainerRef, _renderer: Renderer, componentFactoryResolver: ComponentFactoryResolver);
    open(content?: string | TemplateRef<any>): ComponentRef<T>;
    close(): void;
    private _getContentRef(content);
}
