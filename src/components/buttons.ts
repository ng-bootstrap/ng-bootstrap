import {Directive, View} from 'angular2/angular2';

@Directive({
  selector: '[ngb-button-checkbox]',
  properties: [
    'name: ngb-name', 'checked: ngb-checked', 'class: ngb-class'
  ],
  host: {
    '[class]': 'class',
    '[class.active]': 'checked'
  }
})
@View({
  template: `
    <input type="checkbox" [checked]="checked" [name]="name" autocomplete="off">
    <ng-content></ng-content>`
})
export class NgbButtonCheckbox {
  private checked: boolean;
}

@Directive({
  selector: '[ngb-button-radio]',
  properties: [
    'name: ngb-name', 'checked: ngb-checked', 'class: ngb-class'
  ],
  host: {
    '[class]': 'class',
    '[class.active]': 'checked'
  }
})
@View({
  template: `<input type="radio" [checked]="checked" [name]="name" autocomplete="off">
    <ng-content></ng-content>`
})
export class NgbButtonRadio {
  private checked: boolean;
}