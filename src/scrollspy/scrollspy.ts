import {
  Directive,
  ElementRef,
  Injectable,
  ContentChildren,
  QueryList,
  Input,
  OnDestroy,
  OnInit,
  Renderer,
  Component,
  TemplateRef
} from '@angular/core';
import {toInteger} from '../util/util';

let spies = new Set<NgbScrollSpy>();

@Directive({selector: '[ngbScrollSpy]', host: {'(click)': 'activateOnClick()'}})
export class NgbScrollSpy implements OnDestroy, OnInit {
  @Input('ngbScrollSpy') selector: string | TemplateRef<any>;

  public activeTarget;

  constructor(public elementRef: ElementRef, private renderer: Renderer) {}

  ngOnDestroy(): void { spies.delete(this); }

  ngOnInit(): void { spies.add(this); }

  setActive(offset: HTMLElement) {
    this.activeTarget = offset;
    let element = this.elementRef.nativeElement;
    this.renderer.setElementClass(element, 'active', this.selector === offset.id);
  }

  activateOnClick() {
    spies.forEach(
        spy => this.renderer.setElementClass(spy.elementRef.nativeElement, 'active', spy.selector === this.selector));
  }
}

@Directive({selector: '[ngbScrollTarget]'})
export class NgbScrollTarget implements OnInit {
  private _scrollHeight: number = 0;
  private _offsetElementList: HTMLElement[] = new Array();

  constructor(private elementRef: ElementRef, private renderer: Renderer) {}

  checkSpies() { spies.forEach(spy => this.checkSpy(spy)); }

  getScrollHeight(): number {
    return toInteger(this.elementRef.nativeElement.offsetTop) + this.elementRef.nativeElement.scrollTop;
  }

  checkSpy(spy: NgbScrollSpy) {
    let element = this.elementRef.nativeElement;
    let scrollTop = this.getScrollHeight();
    let scrollHeight = element.scrollHeight;
    let maxScroll = this.elementRef.nativeElement.offsetTop + scrollHeight - this.elementRef.nativeElement.offsetHeight;

    if (scrollTop >= maxScroll) {
      this.activateLastElement(spy);
    } else {
      this.activateElement(spy);
    }
  }

  activateLastElement(spy: NgbScrollSpy) {
    let idx = 0;
    let size = spies.size - 1;
    spies.forEach(spyElement => {
      if (idx === size) {
        if (spy.activeTarget !== spy) {
          spy.setActive(this._offsetElementList[size]);
        }
      }
      idx++;
    });
  }

  activateElement(spy: NgbScrollSpy) {
    let scrollTop = this.getScrollHeight();

    for (let i = this._offsetElementList.length - 1; i >= 0; i--) {
      let totalOffset = this._offsetElementList[i].offsetTop;
      let nextTotalOffset = -1;

      if (this._offsetElementList[i + 1]) {
        nextTotalOffset = this._offsetElementList[i + 1].offsetTop;
      }
      let isActiveTarget = (spy.activeTarget !== this._offsetElementList[i]) && (scrollTop >= totalOffset) &&
          (nextTotalOffset === -1 || scrollTop < nextTotalOffset);

      if (isActiveTarget) {
        spy.setActive(this._offsetElementList[i]);
      }
    }
  }

  ngOnInit(): void {
    spies.forEach(spyElements => {
      let offsetElement = document.getElementById(spyElements.selector.toString());
      this._offsetElementList.push(offsetElement);
    });
    this.renderer.listen(this.elementRef.nativeElement, 'scroll', () => this.checkSpies());
  }
}


export const NGB_SCROLLSPY_DIRECTIVES = [NgbScrollSpy, NgbScrollTarget];
