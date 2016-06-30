import {Component, ChangeDetectionStrategy, Input} from '@angular/core';

const docs = require('../../../../docs.json');

@Component({
  selector: 'ngbd-api-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2><a href="https://github.com/ng-bootstrap/core/tree/master/{{apiDocs.fileName}}" target="_blank">{{apiDocs.className}}</a></h2>
    <p>{{apiDocs.description}}</p>
    <table class="table table-sm table-hover">
      <tbody>
        <tr>
          <td class="col-md-2">Selector</td>
          <td class="col-md-10"><code>{{apiDocs.selector}}</code></td>
        </tr>        
        <tr *ngIf="apiDocs.exportAs">
          <td class="col-md-2">Exported as</td>
          <td class="col-md-10"><code>{{apiDocs.exportAs}}</code></td>
        </tr>
      </tbody>
    </table>
    
    <template [ngIf]="apiDocs.inputs.length">
      <section>
        <h3 id="inputs">Inputs</h3>
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <td class="col-md-2"><strong>Name</strong></td>
              <td class="col-md-2"><strong>Default value</strong></td>
              <td class="col-md-2"><strong>Type</strong></td>
              <td class="col-md-6"><strong>Description</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let input of apiDocs.inputs">
              <td class="col-md-2"><code>{{input.name}}</code></td>
              <td class="col-md-2">{{input.defaultValue || '-'}}</td>
              <td class="col-md-2">{{input.type}}</td>
              <td class="col-md-6">{{input.description}}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
    
    <template [ngIf]="apiDocs.outputs.length">
      <section>
        <h3 id="outputs">Outputs</h3>
        <table class="table table-sm table-hover">
          <thead>
            <tr>
              <td class="col-md-2"><strong>Name</strong></td>
              <td class="col-md-10"><strong>Description</strong></td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let output of apiDocs.outputs">
              <td class="col-md-2"><code>{{output.name}}</code></td>
              <td class="col-md-10">{{output.description}}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  `
})
export class NgbdApiDocs {
  apiDocs;
  @Input() set directive(directiveName) {
    this.apiDocs = docs[directiveName];
  };
}
