import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'].sort();

@Component({
  selector: 'ngbd-typeahead-grouping',
  templateUrl: './typeahead-grouping.html',
  styles: [`.form-control { width: 300px; }`]
})
export class NgbdTypeaheadGrouping {
  public model: any;
  categories: any[];

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.filter(term))
    )

  private filter(term: any) {
    const filtered = states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    this.categories = this.group(filtered);
    return filtered;
  }

  group(items: string[]) {
    let idx = 0;
    let categories = new Map();
    for (const item of items) {
      const key = this.key(item);
      if (!categories.has(key)) {
        categories.set(key, this.category(key));
      }
      categories.get(key).items.push(this.item(item, idx++));
    }
    return Array.from(categories.values());
  }

  private category(key: string) {
    return {
      label: key,
      items: []
    };
  }

  private item(label: string, idx: number) {
    return {
      label, idx
    };
  }

  private key(item: string) {
    return item.toUpperCase().charAt(0);
  }
}
