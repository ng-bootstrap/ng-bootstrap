import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-dropdown',
  template: `
    <ngbd-content-wrapper component="Dropdown">
      <ngbd-api-docs directive="NgbDropdown"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDropdownToggle"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Dropdown" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-dropdown-basic></ngbd-dropdown-basic>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdDropdown {
  snippets = DEMO_SNIPPETS;
}
