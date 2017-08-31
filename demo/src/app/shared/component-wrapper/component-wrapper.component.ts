import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

export const DEFAULT_TAB = 'examples';
const VALID_TABS = [DEFAULT_TAB, 'api'];

@Component({
  selector: 'ngbd-component-wrapper',
  templateUrl: './component-wrapper.component.html'
})
export class ComponentWrapper {

  @Input()
  public component: string;

  public activeTab: string;

  public fileTypes = [
    ['T', 'HTML template file', 'btn-secondary'],
    ['C', 'Component typescript file', 'btn-info'],
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      const tab = params['tab'];
      if (VALID_TABS.indexOf(tab) !== -1) {
        this.activeTab = tab;
      } else {
        this.router.navigate(['..', DEFAULT_TAB], {relativeTo: this.route});
      }
      document.body.scrollIntoView();
    });
  }

  tabChange(event) {
    this.router.navigate(['..', event.nextId], {relativeTo: this.route});
  }
}
