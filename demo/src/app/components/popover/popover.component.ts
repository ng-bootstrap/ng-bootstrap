import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-popover',
  template: `
    <ngbd-content-wrapper component="Popover">
      <ngbd-api-docs directive="NgbPopover"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Quick and easy popovers" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-popover-basic></ngbd-popover-basic>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [NgbdApiDocs, ContentWrapper, ExampleBoxComponent, DEMO_DIRECTIVES]
})
export class NgbdPopover {
  snippets = DEMO_SNIPPETS;
}
