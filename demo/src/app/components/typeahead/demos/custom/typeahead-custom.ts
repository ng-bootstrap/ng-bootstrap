import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operator/map';
import {debounceTime} from 'rxjs/operator/debounceTime';

const statesWithAbbreviations = [
  {'name': 'Alabama', 'abbr': 'AL'},
  {'name': 'Alaska', 'abbr': 'AK'},
  {'name': 'American Samoa', 'abbr': 'AS'},
  {'name': 'Arizona', 'abbr': 'AZ'},
  {'name': 'Arkansas', 'abbr': 'AR'},
  {'name': 'California', 'abbr': 'CA'},
  {'name': 'Colorado', 'abbr': 'CO'},
  {'name': 'Connecticut', 'abbr': 'CT'},
  {'name': 'Delaware', 'abbr': 'DE'},
  {'name': 'District Of Columbia', 'abbr': 'DC'},
  {'name': 'Federated States Of Micronesia', 'abbr': 'FM'},
  {'name': 'Florida', 'abbr': 'FL'},
  {'name': 'Georgia', 'abbr': 'GA'},
  {'name': 'Guam', 'abbr': 'GU'},
  {'name': 'Hawaii', 'abbr': 'HI'},
  {'name': 'Idaho', 'abbr': 'ID'},
  {'name': 'Illinois', 'abbr': 'IL'},
  {'name': 'Indiana', 'abbr': 'IN'},
  {'name': 'Iowa', 'abbr': 'IA'},
  {'name': 'Kansas', 'abbr': 'KS'},
  {'name': 'Kentucky', 'abbr': 'KY'},
  {'name': 'Louisiana', 'abbr': 'LA'},
  {'name': 'Maine', 'abbr': 'ME'},
  {'name': 'Marshall Islands', 'abbr': 'MH'},
  {'name': 'Maryland', 'abbr': 'MD'},
  {'name': 'Massachusetts', 'abbr': 'MA'},
  {'name': 'Michigan', 'abbr': 'MI'},
  {'name': 'Minnesota', 'abbr': 'MN'},
  {'name': 'Mississippi', 'abbr': 'MS'},
  {'name': 'Missouri', 'abbr': 'MO'},
  {'name': 'Montana', 'abbr': 'MT'},
  {'name': 'Nebraska', 'abbr': 'NE'},
  {'name': 'Nevada', 'abbr': 'NV'},
  {'name': 'New Hampshire', 'abbr': 'NH'},
  {'name': 'New Jersey', 'abbr': 'NJ'},
  {'name': 'New Mexico', 'abbr': 'NM'},
  {'name': 'New York', 'abbr': 'NY'},
  {'name': 'North Carolina', 'abbr': 'NC'},
  {'name': 'North Dakota', 'abbr': 'ND'},
  {'name': 'Northern Mariana Islands', 'abbr': 'MP'},
  {'name': 'Ohio', 'abbr': 'OH'},
  {'name': 'Oklahoma', 'abbr': 'OK'},
  {'name': 'Oregon', 'abbr': 'OR'},
  {'name': 'Palau', 'abbr': 'PW'},
  {'name': 'Pennsylvania', 'abbr': 'PA'},
  {'name': 'Puerto Rico', 'abbr': 'PR'},
  {'name': 'Rhode Island', 'abbr': 'RI'},
  {'name': 'South Carolina', 'abbr': 'SC'},
  {'name': 'South Dakota', 'abbr': 'SD'},
  {'name': 'Tennessee', 'abbr': 'TN'},
  {'name': 'Texas', 'abbr': 'TX'},
  {'name': 'Utah', 'abbr': 'UT'},
  {'name': 'Vermont', 'abbr': 'VT'},
  {'name': 'Virgin Islands', 'abbr': 'VI'},
  {'name': 'Virginia', 'abbr': 'VA'},
  {'name': 'Washington', 'abbr': 'WA'},
  {'name': 'West Virginia', 'abbr': 'WV'},
  {'name': 'Wisconsin', 'abbr': 'WI'},
  {'name': 'Wyoming', 'abbr': 'WY'}
];

@Component({
  selector: 'ngbd-typeahead-custom',
  templateUrl: './typeahead-custom.html',
  styles: [`.form-control { width: 300px; } .abbr { display: inline-block; width: 30px; }
    .msg { padding: 3px 5px; background: silver; font-weight: bold; }`]
})
export class NgbdTypeaheadCustom {
  public model: any;

  search = (text$: Observable<string>) =>
    map.call(debounceTime.call(text$, 200),
      term => term === '' ? [] : statesWithAbbreviations.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  formatter = (x: {name: string}) => x.name;
}
