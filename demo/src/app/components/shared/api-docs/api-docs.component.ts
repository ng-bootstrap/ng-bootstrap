import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

const docs = require('../../../../docs.json');

@Component({
  selector: 'ngbd-api-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: require('./api-docs.component.html')
})
export class NgbdApiDocs {
  directiveDocs;
  interfaceDocs;

  @Input() set directive(directiveName) {
    this.directiveDocs = docs[directiveName];
  };
  @Input() set interfaceName(interfaceName) {
    this.interfaceDocs = docs[interfaceName];
  }
}
