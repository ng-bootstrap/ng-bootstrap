import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-popover',
  template: `
    <ngbd-content-wrapper component="Popover">
      <ngbd-api-docs directive="NgbPopover"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbPopoverConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Quick and easy popovers" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-popover-basic></ngbd-popover-basic>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="HTML and bindings in popovers" [htmlSnippet]="snippets.tplcontent.markup" [tsSnippet]="snippets.tplcontent.code">
        <ngbd-popover-tplcontent></ngbd-popover-tplcontent>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Custom and manual triggers" [htmlSnippet]="snippets.triggers.markup" [tsSnippet]="snippets.triggers.code">
        <ngbd-popover-triggers></ngbd-popover-triggers>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Popover visibility events" [htmlSnippet]="snippets.visibility.markup" [tsSnippet]="snippets.visibility.code">
        <ngbd-popover-visibility></ngbd-popover-visibility>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Append popover in the body" [htmlSnippet]="snippets.container.markup" [tsSnippet]="snippets.container.code">
        <ngbd-popover-container></ngbd-popover-container>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Global configuration of popovers" [htmlSnippet]="snippets.config.markup" [tsSnippet]="snippets.config.code">
        <ngbd-popover-config></ngbd-popover-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdPopover {
  snippets = DEMO_SNIPPETS;
}
