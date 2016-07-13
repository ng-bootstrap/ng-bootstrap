import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

const docs = require('../../../../docs.json');

@Component({
  selector: 'ngbd-api-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs.component.html'
})
export class NgbdApiDocs {
  apiDocs;
  @Input() set directive(directiveName) {
    this.apiDocs = docs[directiveName];
  };
}
