import { EventEmitter, ElementRef, Renderer, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
export declare class NgbModalWindow implements OnInit, AfterViewInit, OnDestroy {
    private _elRef;
    private _renderer;
    private _elWithFocus;
    backdrop: boolean | string;
    keyboard: boolean;
    size: string;
    windowClass: string;
    dismissEvent: EventEmitter<{}>;
    constructor(_elRef: ElementRef, _renderer: Renderer);
    backdropClick($event: any): void;
    escKey($event: any): void;
    dismiss(reason: any): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
