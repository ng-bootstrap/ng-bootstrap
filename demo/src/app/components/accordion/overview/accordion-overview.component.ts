import { Component, OnInit } from '@angular/core';
import { NgbdOverview } from '../../shared/overview';
import { NgbdDemoList } from '../../shared';

@Component({
  selector: 'ngbd-accordion-overview',
  templateUrl: './accordion-overview.component.html',
  host: {'[class.overview]': 'true'},
  styleUrls: ['./accordion-overview.component.css']
})
export class NgbdAccordionOverviewComponent {

  BASIC_NO_OPTS = `
  <ngb-accordion>
  <ngb-panel title="Simple">
    <ngb-template ngbPanelContent>
      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia
      aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor,
      sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica,
      craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings
      occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus
      labore sustainable VHS.
    </ngb-template>
  </ngb-panel>
</ngb-accordion>
  `;

  CUSTOM_OPT_1 = `
  <ngb-accordion>
  <ngb-panel>
    <ng-template ngbPanelHeader>
        <button ngbPanelToggle class="btn btn-link stretched-link">Toggle</button>
    </ng-template>
    <ng-template ngbPanelContent>...</ng-template>
  </ngb-panel>
</ngb-accordion>
  `;
  CUSTOM_OPT_2 = `
  <ngb-accordion>
  <ngb-panel>
    <ng-template ngbPanelHeader>
        <button ngbPanelToggle class="btn btn-link w-100 text-left">Toggle</button>
    </ng-template>
    <ng-template ngbPanelContent>...</ng-template>
  </ngb-panel>
</ngb-accordion>
  `;
  CUSTOM_OPT_3 = `
  <ngb-accordion #acc="ngbAccordion">
  <ngb-panel id="myPanel">
    <ng-template ngbPanelHeader>
        <div (click)="acc.toggle('myPanel')">Toggle</div>
    </ng-template>
    <ng-template ngbPanelContent>...</ng-template>
  </ngb-panel>
</ngb-accordion>
  `;

  sections: NgbdOverview = {};

  constructor(demoList: NgbdDemoList) {
    this.sections = demoList.getOverviewSections('accordion');
  }


}
