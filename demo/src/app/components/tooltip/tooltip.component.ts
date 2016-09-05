import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tooltip',
  template: `
    <ngbd-content-wrapper component="Tooltip">
      <ngbd-api-docs directive="NgbTooltip"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbTooltipConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Quick and easy tooltips" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-tooltip-basic></ngbd-tooltip-basic>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="HTML and bindings in tooltips" [htmlSnippet]="snippets.tplcontent.markup" [tsSnippet]="snippets.tplcontent.code">
        <ngbd-tooltip-tplcontent></ngbd-tooltip-tplcontent>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Custom and manual triggers" [htmlSnippet]="snippets.triggers.markup" [tsSnippet]="snippets.triggers.code">
        <ngbd-tooltip-triggers></ngbd-tooltip-triggers>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Global configuration of tooltips" [htmlSnippet]="snippets.config.markup" [tsSnippet]="snippets.config.code">
        <ngbd-tooltip-config></ngbd-tooltip-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdTooltip {
  snippets = DEMO_SNIPPETS;
}
