import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tooltip',
  template: `
    <ngbd-content-wrapper component="Tooltip">
      <ngbd-api-docs directive="NgbTooltip"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Quick and easy tooltips" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-tooltip-basic></ngbd-tooltip-basic>      
      </ngbd-example-box>
    </ngbd-content-wrapper>  
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdTooltip {
  snippets = DEMO_SNIPPETS;
}
