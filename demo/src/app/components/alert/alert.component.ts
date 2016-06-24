import {Component} from '@angular/core';
import {NgbdApiDocs} from '../shared/api-docs';

@Component({
  selector: 'ngbd-alert',
  template: `
    <ngbd-api-docs directive="NgbAlert"></ngbd-api-docs>        
  `,
  directives: [NgbdApiDocs]
})
export class NgbdAlert {
}
