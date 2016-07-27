import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-buttons',
  template: `
    <ngbd-content-wrapper component="Buttons">
      <ngbd-api-docs directive="NgbRadioGroup"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbRadio"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Radio buttons" [snippets]="snippets" component="buttons" demo="radio">
        <ngbd-buttons-radio></ngbd-buttons-radio>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Checkbox buttons" [snippets]="snippets" component="buttons" demo="checkbox">
        <ngbd-buttons-checkbox></ngbd-buttons-checkbox>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdButtons {
   snippets = DEMO_SNIPPETS;
}
