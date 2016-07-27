import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';
import {Component, DebugElement} from '@angular/core';
import {NGB_TYPEAHEAD_DIRECTIVES, NgbTypeahead} from './typeahead';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {NgbTypeaheadWindow} from './typeahead-window';
import {By} from '@angular/platform-browser';
import {expectResults, getWindowLinks} from './test-common';
import {Validators, Control, FormBuilder} from '@angular/common';

enum Key {
  Tab = 9,
  Enter = 13,
  Escape = 27,
  ArrowUp = 38,
  ArrowDown = 40
}

function createKeyDownEvent(key: number) {
  const event = {which: key, preventDefault: () => {}};
  spyOn(event, 'preventDefault');
  return event;
}

function getWindow(element): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('ngb-typeahead-window.dropdown-menu');
}

function getDebugInput(element: DebugElement): DebugElement {
  return element.query(By.directive(NgbTypeahead));
}

function getNativeInput(element: HTMLElement): HTMLInputElement {
  return <HTMLInputElement>element.querySelector('input');
}

function changeInput(element: any, value: string) {
  const input = getNativeInput(element);
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function expectInputValue(element: HTMLElement, value: string) {
  expect(getNativeInput(element).value).toBe(value);
}

function expectWindowResults(element, expectedResults: string[]) {
  const window = getWindow(element);
  expect(getWindow).not.toBeNull();
  expectResults(window, expectedResults);
}

describe('ngb-typeahead', () => {

  describe('valueaccessor', () => {

    it('should format values when no formatter provided', async(inject([TestComponentBuilder], (tcb) => {
         const html = '<input [(ngModel)]="model" [ngbTypeahead]="findNothing" />';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const el = fixture.nativeElement;
           const comp = fixture.componentInstance;
           expectInputValue(el, '');

           comp.model = 'text';
           fixture.detectChanges();
           expectInputValue(el, 'text');

           comp.model = null;
           fixture.detectChanges();
           expectInputValue(el, '');

           comp.model = {};
           fixture.detectChanges();
           expectInputValue(el, '[object Object]');
         });
       })));

    it('should format values with custom formatter provided', async(inject([TestComponentBuilder], (tcb) => {
         const html =
             '<input [(ngModel)]="model" [ngbTypeahead]="findNothing" [inputFormatter]="uppercaseObjFormatter"/>';

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const el = fixture.nativeElement;
           const comp = fixture.componentInstance;
           expectInputValue(el, '');

           comp.model = null;
           fixture.detectChanges();
           expectInputValue(el, '');

           comp.model = {value: 'text'};
           fixture.detectChanges();
           expectInputValue(el, 'TEXT');
         });
       })));
  });

  describe('window', () => {

    it('should be closed by default', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;
           expect(getWindow(compiled)).toBeNull();
         });
       })));

    it('should not be opened when the model changes', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           fixture.componentInstance.model = 'one';
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
         });
       })));

    it('should be opened when there are results', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'one');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);
           expect(fixture.componentInstance.model).toBe('one');
         });
       })));

    it('should be closed when there no results', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="findNothing"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;
           expect(getWindow(compiled)).toBeNull();
         });
       })));

    it('should be closed on document click', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'one');
           fixture.detectChanges();
           expect(getWindow(compiled)).not.toBeNull();

           fixture.nativeElement.click();
           expect(getWindow(compiled)).toBeNull();
         });
       })));

    it('should be closed when ESC is pressed', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'one');
           fixture.detectChanges();
           expect(getWindow(compiled)).not.toBeNull();

           const event = createKeyDownEvent(Key.Escape);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expect(event.preventDefault).toHaveBeenCalled();
         });
       })));

    it('should select the result on click, close window and fill the input',
       async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           // clicking selected
           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);

           getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expectInputValue(compiled, 'one');
           expect(fixture.componentInstance.model).toBe('one');

           // clicking not selected
           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);
           expectInputValue(compiled, 'o');

           getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expectInputValue(compiled, 'one');
         });
       })));

    it('should select the result on ENTER, close window and fill the input',
       async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);

           const event = createKeyDownEvent(Key.Enter);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expectInputValue(compiled, 'one');
           expect(fixture.componentInstance.model).toBe('one');
           expect(event.preventDefault).toHaveBeenCalled();
         });
       })));

    it('should select the result on TAB, close window and fill the input',
       async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expect(getWindow(compiled)).not.toBeNull();

           const event = createKeyDownEvent(Key.Tab);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expectInputValue(compiled, 'one');
           expect(fixture.componentInstance.model).toBe('one');
           expect(event.preventDefault).toHaveBeenCalled();
         });
       })));

    it('should make previous/next results active with up/down arrow keys',
       async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="find"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);

           // down
           let event = createKeyDownEvent(Key.ArrowDown);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expectWindowResults(compiled, ['one', '+one more']);
           expect(event.preventDefault).toHaveBeenCalled();

           event = createKeyDownEvent(Key.ArrowDown);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);
           expect(event.preventDefault).toHaveBeenCalled();

           // up
           event = createKeyDownEvent(Key.ArrowUp);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expectWindowResults(compiled, ['one', '+one more']);
           expect(event.preventDefault).toHaveBeenCalled();

           event = createKeyDownEvent(Key.ArrowUp);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expectWindowResults(compiled, ['+one', 'one more']);
           expect(event.preventDefault).toHaveBeenCalled();
         });
       })));

    it('should use provided result formatter function', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [ngbTypeahead]="find" [resultFormatter]="uppercaseFormatter"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+ONE', 'ONE MORE']);
         });
       })));

  });

  describe('objects', () => {

    it('should work with custom objects as values', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
          [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expectWindowResults(compiled, ['+ONE', 'ONE MORE']);

           const event = createKeyDownEvent(Key.Enter);
           getDebugInput(fixture.debugElement).triggerEventHandler('keydown', event);
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expect(getNativeInput(compiled).value).toBe('1 one');
           expect(fixture.componentInstance.model).toEqual({id: 1, value: 'one'});
         });
       })));

    it('should allow to assign ngModel custom objects', async(inject([TestComponentBuilder], (tcb) => {
         const html = `<input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
          [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           fixture.componentInstance.model = {id: 1, value: 'one'};
           fixture.detectChanges();
           expect(getWindow(compiled)).toBeNull();
           expect(getNativeInput(compiled).value).toBe('1 one');
         });
       })));
  });

  describe('forms', () => {

    it('should work with template-driven form validation', async(inject([TestComponentBuilder], (tcb) => {
         const html = `
        <form>
          <input type="text" [(ngModel)]="model" required [ngbTypeahead]="findObjects" />
        </form>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
           expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
           expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
         });
       })));

    it('should work with model-driven form validation', async(inject([TestComponentBuilder], (tcb) => {
         const html = `
        <form [ngFormModel]="form">
          <input type="text" ngControl="control" required [ngbTypeahead]="findObjects" />
        </form>`;

         tcb.overrideTemplate(TestComponent, html).createAsync(TestComponent).then((fixture) => {
           fixture.detectChanges();
           const compiled = fixture.nativeElement;

           expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
           expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

           changeInput(compiled, 'o');
           fixture.detectChanges();
           expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
           expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
         });
       })));
  });

});

@Component(
    {selector: 'test-cmp', directives: [NGB_TYPEAHEAD_DIRECTIVES], precompile: [NgbTypeaheadWindow], template: ''})
class TestComponent {
  private _strings = ['one', 'one more', 'two', 'three'];
  private _objects =
      [{id: 1, value: 'one'}, {id: 10, value: 'one more'}, {id: 2, value: 'two'}, {id: 3, value: 'three'}];

  model = '';

  form = this._builder.group({control: new Control('', Validators.required)});

  find = (text$: Observable<string>) => { return text$.map(text => this._strings.filter(v => v.startsWith(text))); };

  findNothing = (text$: Observable<string>) => { return text$.map(text => []); };

  findObjects =
      (text$: Observable<string>) => { return text$.map(text => this._objects.filter(v => v.value.startsWith(text))); };

  formatter = (obj: {id: number, value: string}) => { return `${obj.id} ${obj.value}`; };

  uppercaseFormatter = s => s.toUpperCase();

  uppercaseObjFormatter = (obj: {value: string}) => { return obj.value.toUpperCase(); };

  constructor(private _builder: FormBuilder) {}
}
