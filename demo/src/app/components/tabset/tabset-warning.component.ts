import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-tabset-warning',
  template: `
    <ngb-alert type="warning" [dismissible]="false" class="mb-5 d-flex flex-row">
      <div class="mr-2">
        <svg:svg ngbdIcon="lightbulb" fill="currentColor" />
      </div>
      <div>
        Since version <span class="badge badge-info" >5.2.0</span> please consider using
        <a routerLink="../../nav">Nav directives</a> as a more flexible alternative.
        Tabset will not be supported anymore and will be deprecated.
      </div>
    </ngb-alert>
  `
})
export class NgbdTabsetWarningComponent {
}
