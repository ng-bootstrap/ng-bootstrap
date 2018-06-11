import {Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import {NgbClickOutside, NgbClickOutsideFactory} from './clickoutside';

const getElement = (element: HTMLElement, selector: string): HTMLElement => {
  return element.querySelector(selector) as HTMLElement;
};

function dispatchEvent(element: HTMLElement, eventName: string) {
  const event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
  return event;
}

describe('ngbClickoutside', () => {
  let fixture;
  let instance;
  let coComponent;
  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent, ClickedOutsideComponent], providers: [NgbClickOutsideFactory]});
    fixture = TestBed.createComponent(TestComponent);
    instance = fixture.componentInstance;
    coComponent = instance.coComponent;

    fixture.detectChanges();
  });

  it('should be instantiated on a component', () => {
    expect(fixture).toBeDefined();
    expect(instance).toBeDefined();
    expect(coComponent).toBeDefined();
    expect(coComponent.clickOutside instanceof NgbClickOutside).toBeTruthy();
  });

  it('should execute callback when clicked on a parent', () => {
    spyOn(coComponent, 'onClickOutside');
    const parent = getElement(fixture.nativeElement, '.parent');
    dispatchEvent(parent, 'click');
    fixture.detectChanges();

    expect(coComponent.onClickOutside).toHaveBeenCalled();
  });

  it('should not execute handler when clicked from a child', () => {
    spyOn(coComponent, 'onClickOutside');
    const child = getElement(fixture.nativeElement, '.child');
    dispatchEvent(child, 'click');
    fixture.detectChanges();

    expect(coComponent.onClickOutside).not.toHaveBeenCalled();
  });
});

@Component({
  selector: 'clicked-outside',
  template: `
    <div class="child"></div>
  `
})
class ClickedOutsideComponent implements OnDestroy {
  private clickOutside: NgbClickOutside | null = null;

  constructor(private clickFactory: NgbClickOutsideFactory, private element: ElementRef) {
    this.clickOutside = this.clickFactory.create(this.element.nativeElement, event => this.onClickOutside(event));
  }

  ngOnDestroy() { this.clickOutside.destroy(); }

  onClickOutside(event) {}
}

@Component({
  template: `
    <div class="parent">
      <clicked-outside></clicked-outside>
    </div>
  `
})
class TestComponent {
  @ViewChild(ClickedOutsideComponent) coComponent;
}
