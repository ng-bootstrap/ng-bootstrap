import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';
import {ClassDesc, MethodDesc, signature} from './api-docs.model';

/**
 * Displays the API docs of a class, which is not a directive.
 *
 * For Config services, use NgbdApiDocsConfig instead.
 */
@Component({
  selector: 'ngbd-api-docs-class',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs-class.component.html'
})
export class NgbdApiDocsClass {
  apiDocs: ClassDesc;
  @Input() set type(typeName: string) {
    this.apiDocs = docs[typeName];
  };

  methodSignature(method: MethodDesc): string { return signature(method); }
}
