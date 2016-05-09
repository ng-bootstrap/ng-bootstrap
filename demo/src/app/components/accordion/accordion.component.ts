import { Component } from '@angular/core';

import 'prismjs/themes/prism-okaidia.css';

// import { AccordionDemoComponent } from 'core/accordion/demo/demo.ts';

// import { NgbAccordion } from '../../../../../core/src/accordion/accordion';

import { NgbAccordion, NgbPanel } from '../../../../../src/accordion/accordion';

// const demoMarkdown = require('./demo/demo.md');
// const tsContent = require('!!prismjs?lang=typescript!./demo/demo.ts');
// const htmlContent = require('!!prismjs?lang=markup!./demo/demo.html');

@Component({
  selector: 'ngbd-accordion',
  template: require('./accordion.component.html'),
  directives: [NgbAccordion, NgbPanel]
})
export class AccordionComponent {
  // instructions = demoMarkdown;
  // tsCode = tsContent;
  // htmlCode = htmlContent;
}
