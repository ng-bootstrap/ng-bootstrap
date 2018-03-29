import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-progressbar-stacked',
  templateUrl: './progressbar-stacked.html'
})
export class NgbdProgressbarStacked {
  bars = [
    {type: 'success', value: 15},
    {type: 'info', value: 35, showValue: true},
    {type: 'warning', value: 20, striped: true},
    {type: 'danger', value: 30, striped: true, showValue: true}
  ];
}
