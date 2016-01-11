import {Component, Input, OnInit} from 'angular2/core';
import {DatePipe} from 'angular2/common';

import {NgbDatepickerEngine} from './datepickerEngine';

@Component({
  selector: 'ngb-datepicker',
  template: `
    <div class="card">
      <div class="card-header">
        {{date | date:'MMMM yyyy'}}
      </div>
      <div class="card-block">
        <div *ngFor="#day of days" class="a-day">
          <span>{{day}}</span>
        <div>
      </div>
    </div>
  `,
  styles: [
    `
    .card {
        width: 285px;
        height: 245px;
    }
    .card-header {
      text-align: center;
    }
    .a-day {
        display: inline-block;
        text-align: right;
        width: 42px;
        height: 25px;
    }
    .a-day span {
        margin-right: 4px;
        margin-top: 4px;
    }
  `
  ]
})
export class NgbDatepicker implements OnInit {
  days: number[] = [];

  @Input() date: Date;
  @Input() startOnMonday: boolean | string;

  isMondayFirst(): boolean { return this.startOnMonday === '' ? true : !!this.startOnMonday; }

  constructor(private engine: NgbDatepickerEngine) {}

  ngOnInit() { this.days = this.engine.getDays(this.date.getFullYear(), this.date.getMonth(), this.isMondayFirst()); }
}
