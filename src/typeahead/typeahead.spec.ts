import {TestBed, ComponentFixture} from '@angular/core/testing';
import {createGenericTestComponent} from '../util/tests';
import {expectResults, getWindowLinks} from './test-common';

import {Component, DebugElement} from '@angular/core';
import {Validators, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import {NgbTypeahead} from './typeahead';
import {NgbTypeaheadModule} from './index';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

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
  const evt = document.createEvent('MouseEvent');
  evt.initEvent('input', true, true);
  input.dispatchEvent(evt);
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

  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbTypeaheadModule, FormsModule, ReactiveFormsModule]});
  });

  describe('valueaccessor', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should format values when no formatter provided', () => {
      const fixture = createTestComponent('<input [(ngModel)]="model" [ngbTypeahead]="findNothing" />');

      const el = fixture.nativeElement;
      const comp = fixture.componentInstance;
      expectInputValue(el, '');

      comp.model = 'text';
      fixture.detectChanges();
      fixture.whenStable()
          .then(() => {
            expectInputValue(el, 'text');

            comp.model = null;
            fixture.detectChanges();
            return fixture.whenStable();
          })
          .then(() => {
            expectInputValue(el, '');

            comp.model = {};
            fixture.detectChanges();
            return fixture.whenStable();
          })
          .then(() => { expectInputValue(el, '[object Object]'); });
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should format values with custom formatter provided', () => {
      const html = '<input [(ngModel)]="model" [ngbTypeahead]="findNothing" [inputFormatter]="uppercaseObjFormatter"/>';
      const fixture = createTestComponent(html);
      const el = fixture.nativeElement;
      const comp = fixture.componentInstance;
      expectInputValue(el, '');

      comp.model = null;
      fixture.detectChanges();
      fixture.whenStable()
          .then(() => {
            expectInputValue(el, '');

            comp.model = {value: 'text'};
            fixture.detectChanges();
            return fixture.whenStable();
          })
          .then(() => { expectInputValue(el, 'TEXT'); });
    });
  });

  describe('window', () => {

    it('should be closed by default', () => {
      const fixture = createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;
      expect(getWindow(compiled)).toBeNull();
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should not be opened when the model changes', () => {
      const fixture = createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;

      fixture.componentInstance.model = 'one';
      fixture.detectChanges();
      fixture.whenStable().then(() => { expect(getWindow(compiled)).toBeNull(); });
    });

    it('should be opened when there are results', () => {
      const fixture = createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;

      fixture.whenStable().then(() => {
        changeInput(compiled, 'one');
        fixture.detectChanges();
        expectWindowResults(compiled, ['+one', 'one more']);
        expect(fixture.componentInstance.model).toBe('one');
      });
    });

    it('should be closed when there no results', () => {
      const fixture = createTestComponent(`<input type="text" [ngbTypeahead]="findNothing"/>`);
      const compiled = fixture.nativeElement;

      expect(getWindow(compiled)).toBeNull();
    });

    it('should be closed on document click', () => {
      const fixture = createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;

      changeInput(compiled, 'one');
      fixture.detectChanges();
      expect(getWindow(compiled)).not.toBeNull();

      fixture.nativeElement.click();
      expect(getWindow(compiled)).toBeNull();
    });

    it('should be closed when ESC is pressed', () => {
      const fixture = createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
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

    it('should select the result on click, close window and fill the input', () => {
      const fixture = createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;

      fixture.whenStable().then(() => {
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
    });

    it('should select the result on ENTER, close window and fill the input', () => {
      const fixture = createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
      const compiled = fixture.nativeElement;

      fixture.whenStable().then(() => {
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
    });

    it('should select the result on TAB, close window and fill the input', () => {
      const fixture = createTestComponent(`<input type="text" [(ngModel)]="model" [ngbTypeahead]="find"/>`);
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

    it('should make previous/next results active with up/down arrow keys', () => {
      const fixture = createTestComponent(`<input type="text" [ngbTypeahead]="find"/>`);
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

    it('should use provided result formatter function', () => {
      const fixture =
          createTestComponent(`<input type="text" [ngbTypeahead]="find" [resultFormatter]="uppercaseFormatter"/>`);
      const compiled = fixture.nativeElement;

      changeInput(compiled, 'o');
      fixture.detectChanges();
      expectWindowResults(compiled, ['+ONE', 'ONE MORE']);
    });

  });

  describe('objects', () => {

    it('should work with custom objects as values', () => {
      const fixture = createTestComponent(`
             <input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
                    [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`);
      const compiled = fixture.nativeElement;

      fixture.whenStable().then(() => {
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
    });

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should allow to assign ngModel custom objects', () => {
      const fixture = createTestComponent(`
             <input type="text" [(ngModel)]="model" [ngbTypeahead]="findObjects"
                    [inputFormatter]="formatter" [resultFormatter]="uppercaseObjFormatter"/>`);
      const compiled = fixture.nativeElement;

      fixture.componentInstance.model = {id: 1, value: 'one'};
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(getWindow(compiled)).toBeNull();
        expect(getNativeInput(compiled).value).toBe('1 one');
      });
    });
  });

  describe('forms', () => {

    // TODO: remove 'whenStable' once 'core/testing' is fixed
    it('should work with template-driven form validation', () => {
      const html = `
            <form>
              <input type="text" [(ngModel)]="model" name="control" required [ngbTypeahead]="findObjects" />
            </form>`;
      const fixture = createTestComponent(html);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const compiled = fixture.nativeElement;
        expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
        expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

        changeInput(compiled, 'o');
        fixture.detectChanges();
        expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
        expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
      });
    });

    it('should work with model-driven form validation', () => {
      const html = `
           <form [formGroup]="form">
             <input type="text" formControlName="control" required [ngbTypeahead]="findObjects" />
           </form>`;
      const fixture = createTestComponent(html);
      const compiled = fixture.nativeElement;

      expect(getNativeInput(compiled)).toHaveCssClass('ng-invalid');
      expect(getNativeInput(compiled)).not.toHaveCssClass('ng-valid');

      changeInput(compiled, 'o');
      fixture.detectChanges();
      expect(getNativeInput(compiled)).toHaveCssClass('ng-valid');
      expect(getNativeInput(compiled)).not.toHaveCssClass('ng-invalid');
    });
  });

  describe('select event', () => {

    it('should raise select event when a result is selected', () => {
      const fixture = createTestComponent('<input type="text" [ngbTypeahead]="find" (selectItem)="onSelect($event)"/>');
      const input = getNativeInput(fixture.nativeElement);

      // clicking selected
      changeInput(fixture.nativeElement, 'o');
      fixture.detectChanges();
      getWindowLinks(fixture.debugElement)[0].triggerEventHandler('click', {});
      fixture.detectChanges();

      expect(fixture.componentInstance.selectEventValue).toBe('one');
    });
  });

  describe('auto attributes', () => {

    it('should have autocomplete, autocapitalize and autocorrect attributes set to off', () => {
      const fixture = createTestComponent('<input type="text" [ngbTypeahead]="findObjects" />');
      const input = getNativeInput(fixture.nativeElement);

      expect(input.getAttribute('autocomplete')).toBe('off');
      expect(input.getAttribute('autocapitalize')).toBe('off');
      expect(input.getAttribute('autocorrect')).toBe('off');
    });
  });

});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  private _strings = ['one', 'one more', 'two', 'three'];
  private _objects =
      [{id: 1, value: 'one'}, {id: 10, value: 'one more'}, {id: 2, value: 'two'}, {id: 3, value: 'three'}];

  model: any;
  selectEventValue: any;

  form = new FormGroup({control: new FormControl('', Validators.required)});

  find = (text$: Observable<string>) => { return text$.map(text => this._strings.filter(v => v.startsWith(text))); };

  findNothing = (text$: Observable<string>) => { return text$.map(text => []); };

  findObjects =
      (text$: Observable<string>) => { return text$.map(text => this._objects.filter(v => v.value.startsWith(text))); };

  formatter = (obj: {id: number, value: string}) => { return `${obj.id} ${obj.value}`; };

  uppercaseFormatter = s => s.toUpperCase();

  uppercaseObjFormatter = (obj: {value: string}) => { return obj.value.toUpperCase(); };

  onSelect($event) { this.selectEventValue = $event; }
}
