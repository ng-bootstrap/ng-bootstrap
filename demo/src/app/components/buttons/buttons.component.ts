import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-buttons',
  template: `
    <ngbd-content-wrapper component="Buttons">
      <ngbd-api-docs directive="NgbRadioGroup"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbRadio"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Radio buttons" [htmlSnippet]="snippets.radio.markup" [tsSnippet]="snippets.radio.code">
        <ngbd-radio-basic></ngbd-radio-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Checkbox buttons" [htmlSnippet]="snippets.checkbox.markup" [tsSnippet]="snippets.checkbox.code">
        <ngbd-checkbox-basic></ngbd-checkbox-basic>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdButtons {
   snippets = DEMO_SNIPPETS;
}
