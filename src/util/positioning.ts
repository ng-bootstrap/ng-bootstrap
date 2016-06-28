// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export class Positioning {
  private getStyle(element: HTMLElement, prop: string): string { return window.getComputedStyle(element)[prop]; }

  private isStaticPositioned(element: HTMLElement): boolean {
    return (this.getStyle(element, 'position') || 'static') === 'static';
  }

  private parentOffsetElement(element: HTMLElement): HTMLElement {
    let offsetParentEl = <HTMLElement>element.offsetParent || document.documentElement;

    while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
      offsetParentEl = <HTMLElement>offsetParentEl.offsetParent;
    }

    return offsetParentEl || document.documentElement;
  }

  position(element: HTMLElement): ClientRect {
    const elOffset = this.offset(element);
    const offsetParentEl = this.parentOffsetElement(element);

    let parentOffset: ClientRect = {width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0};

    if (offsetParentEl !== document.documentElement) {
      parentOffset = this.offset(offsetParentEl);
      parentOffset.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
      parentOffset.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
    }

    return {
      height: elOffset.height,
      width: elOffset.width,
      top: elOffset.top - parentOffset.top,
      bottom: elOffset.bottom - parentOffset.top,
      left: elOffset.left - parentOffset.left,
      right: elOffset.right - parentOffset.left
    };
  }

  offset(element: HTMLElement): ClientRect {
    const elBcr = element.getBoundingClientRect();

    return {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + (window.pageYOffset || document.documentElement.scrollTop),
      bottom: elBcr.bottom + (window.pageYOffset || document.documentElement.scrollTop),
      left: elBcr.left + (window.pageXOffset || document.documentElement.scrollLeft),
      right: elBcr.right + (window.pageXOffset || document.documentElement.scrollLeft)
    };
  }

  positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean):
      ClientRect {
    const hostElPosition = appendToBody ? this.offset(hostElement) : this.position(hostElement);
    const shiftWidth: any = {
      left: hostElPosition.left,
      center: hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2,
      right: hostElPosition.left + hostElPosition.width
    };
    const shiftHeight: any = {
      top: hostElPosition.top,
      center: hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2,
      bottom: hostElPosition.top + hostElPosition.height
    };
    const targetElBCR = targetElement.getBoundingClientRect();
    const placementPrimary = placement.split('-')[0] || 'top';
    const placementSecondary = placement.split('-')[1] || 'center';

    let targetElPosition: ClientRect = {
      height: targetElBCR.height || targetElement.offsetHeight,
      width: targetElBCR.width || targetElement.offsetWidth,
      top: 0,
      bottom: targetElBCR.height || targetElement.offsetHeight,
      left: 0,
      right: targetElBCR.width || targetElement.offsetWidth
    };

    switch (placementPrimary) {
      case 'top':
        targetElPosition.top = hostElPosition.top - targetElement.offsetHeight;
        targetElPosition.bottom += hostElPosition.top - targetElement.offsetHeight;
        targetElPosition.left = shiftWidth[placementSecondary];
        targetElPosition.right += shiftWidth[placementSecondary];
        break;
      case 'bottom':
        targetElPosition.top = shiftHeight[placementPrimary];
        targetElPosition.bottom += shiftHeight[placementPrimary];
        targetElPosition.left = shiftWidth[placementSecondary];
        targetElPosition.right += shiftWidth[placementSecondary];
        break;
      case 'left':
        targetElPosition.top = shiftHeight[placementSecondary];
        targetElPosition.bottom += shiftHeight[placementSecondary];
        targetElPosition.left = hostElPosition.left - targetElement.offsetWidth;
        targetElPosition.right += hostElPosition.left - targetElement.offsetWidth;
        break;
      case 'right':
        targetElPosition.top = shiftHeight[placementSecondary];
        targetElPosition.bottom += shiftHeight[placementSecondary];
        targetElPosition.left = shiftWidth[placementPrimary];
        targetElPosition.right += shiftWidth[placementPrimary];
        break;
    }

    return targetElPosition;
  }
}
