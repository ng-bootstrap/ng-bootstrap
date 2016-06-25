import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-collapse',
  template: `
    <ngbd-api-docs directive="NgbCollapse"></ngbd-api-docs>
  `,
  directives: [NgbdApiDocs]
})
export class NgbdCollapse {}
