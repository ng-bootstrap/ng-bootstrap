import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tooltip',
  template: `
    <ngbd-content-wrapper component="Tooltip">
      <ngbd-api-docs directive="NgbTooltip"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbTooltipConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Quick and easy tooltips" [snippets]="snippets" component="tooltip" demo="basic">
        <ngbd-tooltip-basic></ngbd-tooltip-basic>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="HTML and bindings in tooltips" [snippets]="snippets" component="tooltip" demo="tplcontent">
        <ngbd-tooltip-tplcontent></ngbd-tooltip-tplcontent>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Custom and manual triggers" [snippets]="snippets" component="tooltip" demo="triggers">
        <ngbd-tooltip-triggers></ngbd-tooltip-triggers>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Context and manual triggers" [snippets]="snippets" component="tooltip" demo="tplwithcontext">
        <ngbd-tooltip-tplwithcontext></ngbd-tooltip-tplwithcontext>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Append tooltip in the body" [snippets]="snippets" component="tooltip" demo="container">
        <ngbd-tooltip-container></ngbd-tooltip-container>
      </ngbd-example-box>
      <ngbd-example-box
        demoTitle="Global configuration of tooltips" [snippets]="snippets" component="tooltip" demo="config">
        <ngbd-tooltip-config></ngbd-tooltip-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdTooltip {
  snippets = DEMO_SNIPPETS;
}
