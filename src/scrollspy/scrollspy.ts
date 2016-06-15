import {Directive, ElementRef, Injectable, Input, OnDestroy, OnInit, Renderer} from '@angular/core';

@Directive({selector: '[ngbScrollSpy]'})
export class NgbScrollSpy implements OnDestroy, OnInit {
  constructor(public elementRef: ElementRef, private renderer: Renderer, private scrollSpier: NgbScrollSpier) {}

  @Input('ngbScrollSpy') selector: string;

  ngOnDestroy(): void { this.scrollSpier.deregister(this); }

  ngOnInit(): void { this.scrollSpier.register(this); }

  setActive(target: HTMLElement) {
    let element = this.elementRef.nativeElement;
    this.renderer.setElementClass(
        element, 'active',
        target.offsetTop <= element.scrollTop && target.offsetTop + target.offsetHeight >= element.scrollTop);
  }
}

@Directive({selector: '[ngbScrollTarget]'})
export class NgbScrollTarget implements OnInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer, private scrollSpier: NgbScrollSpier) {}

  checkSpies() { this.scrollSpier.spies.forEach(spy => this.checkSpy(spy)); }

  checkSpy(spy: NgbScrollSpy) {
    let element = this.elementRef.nativeElement;
    let target = element.querySelector(spy.selector);

    if (!target) {
      return;
    }

    spy.setActive(target);
  }

  ngOnInit(): void { this.renderer.listen(this.elementRef.nativeElement, 'scroll', () => this.checkSpies()); }
}

@Injectable()
export class NgbScrollSpier {
  spies = new Set<NgbScrollSpy>();

  deregister(spy: NgbScrollSpy): void { this.spies.delete(spy); }

  register(spy: NgbScrollSpy): void { this.spies.add(spy); }
}
