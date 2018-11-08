import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

export interface Color {
  name: string;
  hexCode: string;
}

export const COLORS: Color[] = [
  {name: 'black', hexCode: '000000'},
  {name: 'white', hexCode: 'FFFFFF'},
  {name: 'red', hexCode: 'FF0000'},
  {name: 'green', hexCode: '008000'},
  {name: 'yellow', hexCode: 'FFFF00'},
  {name: 'blue', hexCode: '0000FF'},
  {name: 'brown', hexCode: 'A52A2A'},
  {name: 'orange', hexCode: 'FFA500'},
  {name: 'pink', hexCode: 'FFC0CB'},
  {name: 'purple', hexCode: '800080'},
  {name: 'grey', hexCode: '808080'},
];

@Component({
  selector: 'ngbd-typeahead-overview-section-introduction',
  templateUrl: './template.html',
  styles: [
    `
    .middle > * {
      vertical-align: middle;
    }

    .color-chip {
      display: inline-block;
      height: 1em;
      width: 1em;
      border-radius: 0.5em;
      border: solid black 1px;
      margin-right: 0.30em;
      margin-top: 2px;
    }

    #demo {
      width: 100%;
      display: flex;
      align-items: center;
      padding-bottom: 2em;
      margin-bottom: 2em;
      border-bottom: 0.25em solid hsla(24, 20%, 50%, 0.08);
    }

    #demo > label {
      padding-right: 1em;
      margin-bottom: unset;
    }

    #demo > .form-control {
      width: unset;
      flex-grow: 1;
    }

    #demo > .spacer {
      flex-grow: 3;
    }
    `
  ]
})
export class NgbdTypeaheadOverviewSectionIntroductionComponent {
  model: string;

  initializeTypeahead = (text$: Observable<string>): Observable<Color[]> => text$.pipe(
    debounceTime(200),
    map(term => term === '' ? COLORS : COLORS.filter(color => color.name.toLowerCase().startsWith(term.toLowerCase()))),
  )

  inputFormatter(color: Color) {
    return color.name;
  }
}
