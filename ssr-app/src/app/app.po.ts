import {$} from 'protractor';

export class ApplicationPage {
  getHeading() { return $('h1'); }
}
