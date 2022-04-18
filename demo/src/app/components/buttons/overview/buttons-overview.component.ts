import {Component} from '@angular/core';

import {Snippet} from '../../../shared/code/snippet';
import {NgbdDemoList} from '../../shared';
import {NgbdOverview} from '../../shared/overview';
import {FormControl, FormGroup} from '@angular/forms';


@Component({
  selector: 'ngbd-buttons-overview',
  templateUrl: './buttons-overview.component.html',
  host: {'[class.overview]': 'true'}
})
export class NgbdButtonsOverviewComponent {

  radio = new FormControl(1);
  checkbox = new FormGroup({
    'one': new FormControl(true),
    'two': new FormControl(false)
  });

  DEMO_4_CHECKBOXES = Snippet({
    lang: 'html',
    code: `
      <div class="btn-group" role="group">
        <label class="btn-primary" ngbButtonLabel>
          <input type="checkbox" class="btn-check" ngbButton [(ngModel)]="model.left"> One
        </label>
        <label class="btn-primary" ngbButtonLabel>
          <input type="checkbox" class="btn-check" ngbButton [(ngModel)]="model.middle"> Two
        </label>
      </div>
    `,
  });

  DEMO_4_RADIOS = Snippet({
    lang: 'html',
    code: `
      <div class="btn-group" role="group" ngbRadioGroup name="radioBasic" [(ngModel)]="model">
        <label ngbButtonLabel class="btn-primary">
          <input ngbButton type="radio" class="btn-check" [value]="1"> One
        </label>
        <label ngbButtonLabel class="btn-primary">
          <input ngbButton type="radio" class="btn-check" [value]="2"> Two
        </label>
      </div>
    `,
  });

  DEMO_5_CHECKBOXES = Snippet({
    lang: 'html',
    code: `
      <div class="btn-group" [formGroup]="checkbox" role="group" aria-label="Checkboxes with Bootstrap 5">
        <input type="checkbox" formControlName="one" class="btn-check" id="btncheck1" autocomplete="off">
        <label class="btn btn-outline-primary" for="btncheck1">One</label>

        <input type="checkbox" formControlName="two" class="btn-check" id="btncheck2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btncheck2">Two</label>
      </div>

      <pre">Value: {{ checkbox.value | json }}</pre>
    `,
  });

  DEMO_5_RADIOS = Snippet({
    lang: 'html',
    code: `
      <div class="btn-group" role="group" aria-label="Radio Buttons with Bootstrap 5">
        <input type="radio" [formControl]="radio" [value]="1" class="btn-check" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio1">One</label>

        <input type="radio" [formControl]="radio" [value]="2" class="btn-check" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio2">Two</label>
      </div>

      <pre>Value: {{ radio.value }}</pre>
    `,
  });

  sections: NgbdOverview = {};

  constructor(demoList: NgbdDemoList) {
    this.sections = demoList.getOverviewSections('buttons');
  }
}
