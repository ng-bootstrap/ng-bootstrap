import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';
import {distinctUntilChanged} from 'rxjs/operator/distinctUntilChanged';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

@Component({
  selector: 'ngbd-typeahead-config',
  templateUrl: './typeahead-config.html',
  styles: [`.form-control { width: 300px; }`],
  providers: [NgbTypeaheadConfig] // add NgbTypeaheadConfig to the component providers
})
export class NgbdTypeaheadConfig {
  public model: any;

  constructor(config: NgbTypeaheadConfig) {
    // customize default values of typeaheads used by this component tree
    config.showHint = true;
  }

  search = (text$: Observable<string>) =>
    map.call(distinctUntilChanged.call(debounceTime.call(text$, 200)),
      term => term.length < 2 ? [] : states.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10));
}
