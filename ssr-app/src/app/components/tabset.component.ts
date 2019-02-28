import { Component } from '@angular/core';

@Component({
  selector: 'tabset-component',
  template: `
    <ngb-tabset>
      <ngb-tab title="Tab one">
        <ng-template ngbTabContent>Content one</ng-template>
      </ngb-tab>
      <ngb-tab>
        <ng-template ngbTabTitle><b>Tab</b> two</ng-template>
        <ng-template ngbTabContent>Content two</ng-template>
      </ngb-tab>
      <ngb-tab title="Tab three" [disabled]="true">
        <ng-template ngbTabContent>Content three</ng-template>
      </ngb-tab>
    </ngb-tabset>
  `
})
export class TabsetComponent {
}
