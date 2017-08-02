import { Renderer, ElementRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
export declare class NgbRadioGroup implements ControlValueAccessor {
    private _radios;
    private _value;
    private _disabled;
    disabled: boolean;
    onChange: (_: any) => void;
    onTouched: () => void;
    onRadioChange(radio: NgbRadio): void;
    onRadioValueUpdate(): void;
    register(radio: NgbRadio): void;
    registerOnChange(fn: (value: any) => any): void;
    registerOnTouched(fn: () => any): void;
    setDisabledState(isDisabled: boolean): void;
    unregister(radio: NgbRadio): void;
    writeValue(value: any): void;
    private _updateRadiosValue();
    private _updateRadiosDisabled();
}
export declare class NgbActiveLabel {
    private _renderer;
    private _elRef;
    constructor(_renderer: Renderer, _elRef: ElementRef);
    active: boolean;
    disabled: boolean;
    focused: boolean;
}
/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
export declare class NgbRadio implements OnDestroy {
    private _group;
    private _label;
    private _renderer;
    private _element;
    private _checked;
    private _disabled;
    private _value;
    /**
     * You can specify model value of a given radio by binding to the value property.
    */
    value: any;
    checked: any;
    disabled: any;
    focused: boolean;
    constructor(_group: NgbRadioGroup, _label: NgbActiveLabel, _renderer: Renderer, _element: ElementRef);
    ngOnDestroy(): void;
    onChange(): void;
    updateValue(value: any): void;
    updateDisabled(): void;
}
