import { Subscription } from 'rxjs/Subscription';
import { Directive, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Directive({
  selector: 'a[ngbdFragment]',
  host: {
    '[class.fragment]': 'true'
  }
})
export class NgbdFragment implements OnInit, OnDestroy {
  @Input() fragment: string;

  private fragmentRouteSubscription: Subscription;

  constructor(private route: ActivatedRoute, private elementRef: ElementRef) { }

  ngOnInit() {
    this.fragmentRouteSubscription = this.route.fragment.subscribe(f => {
      if (f === this.fragment) {
        this.scrollToFragment(f);
      }
    });
  }

  ngOnDestroy() {
    if (this.fragmentRouteSubscription) {
      this.fragmentRouteSubscription.unsubscribe();
    }
  }

  /**
   * Make the fragment scroll into view
   * @param fragment name of the CSS id to scroll to
   */
  private scrollToFragment(fragment: string) {
    this.elementRef.nativeElement.scrollIntoView(this.elementRef.nativeElement);
  }
}
