import { Component, Input } from '@angular/core';
import {Angulartics2On} from 'angulartics2';

import { NgbTabContent, NgbTab, NgbTabset } from '../../../../../../src/tabset/tabset';

@Component({
  selector: 'ngbd-example-box',
  templateUrl: './example-box.component.html',
  directives: [Angulartics2On, NgbTab, NgbTabset, NgbTabContent]
})
export class ExampleBoxComponent {
  @Input() demoTitle: string;
  @Input() htmlSnippet: string;
  @Input() tsSnippet: string;
}
