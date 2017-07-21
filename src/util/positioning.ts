import {isNumber, isDefined} from  './util';

// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
export class Positioning {
  private getStyle(element: HTMLElement, prop: string): string { return window.getComputedStyle(element)[prop]; }

  private isStaticPositioned(element: HTMLElement): boolean {
    return (this.getStyle(element, 'position') || 'static') === 'static';
  }

  private offsetParent(element: HTMLElement): HTMLElement {
    let offsetParentEl = <HTMLElement>element.offsetParent || document.documentElement;

    while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
      offsetParentEl = <HTMLElement>offsetParentEl.offsetParent;
    }

    return offsetParentEl || document.documentElement;
  }

  position(element: HTMLElement, round = true): ClientRect {
    let elPosition: ClientRect;
    let parentOffset: ClientRect = {width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0};

    if (this.getStyle(element, 'position') === 'fixed') {
      elPosition = element.getBoundingClientRect();
    } else {
      const offsetParentEl = this.offsetParent(element);

      elPosition = this.offset(element, false);

      if (offsetParentEl !== document.documentElement) {
        parentOffset = this.offset(offsetParentEl, false);
      }

      parentOffset.top += offsetParentEl.clientTop;
      parentOffset.left += offsetParentEl.clientLeft;
    }

    elPosition.top -= parentOffset.top;
    elPosition.bottom -= parentOffset.top;
    elPosition.left -= parentOffset.left;
    elPosition.right -= parentOffset.left;

    if (round) {
      elPosition.top = Math.round(elPosition.top);
      elPosition.bottom = Math.round(elPosition.bottom);
      elPosition.left = Math.round(elPosition.left);
      elPosition.right = Math.round(elPosition.right);
    }

    return elPosition;
  }

  offset(element: HTMLElement, round = true): ClientRect {
    const elBcr = element.getBoundingClientRect();
    const viewportOffset = {
      top: window.pageYOffset - document.documentElement.clientTop,
      left: window.pageXOffset - document.documentElement.clientLeft
    };

    let elOffset = {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + viewportOffset.top,
      bottom: elBcr.bottom + viewportOffset.top,
      left: elBcr.left + viewportOffset.left,
      right: elBcr.right + viewportOffset.left
    };

    if (round) {
      elOffset.height = Math.round(elOffset.height);
      elOffset.width = Math.round(elOffset.width);
      elOffset.top = Math.round(elOffset.top);
      elOffset.bottom = Math.round(elOffset.bottom);
      elOffset.left = Math.round(elOffset.left);
      elOffset.right = Math.round(elOffset.right);
    }

    return elOffset;
  }

  positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean):
      ClientRect {
    const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
    const targetElBCR = targetElement.getBoundingClientRect();
    const placementPrimary = placement.split('-')[0] || 'top';
    const placementSecondary = placement.split('-')[1] || 'center';

    let targetElPosition: ClientRect = {
      'height': targetElBCR.height || targetElement.offsetHeight,
      'width': targetElBCR.width || targetElement.offsetWidth,
      'top': 0,
      'bottom': targetElBCR.height || targetElement.offsetHeight,
      'left': 0,
      'right': targetElBCR.width || targetElement.offsetWidth
    };

    switch (placementPrimary) {
      case 'top':
        targetElPosition.top = hostElPosition.top - targetElement.offsetHeight;
        break;
      case 'bottom':
        targetElPosition.top = hostElPosition.top + hostElPosition.height;
        break;
      case 'left':
        targetElPosition.left = hostElPosition.left - targetElement.offsetWidth;
        break;
      case 'right':
        targetElPosition.left = hostElPosition.left + hostElPosition.width;
        break;
    }

    switch (placementSecondary) {
      case 'top':
        targetElPosition.top = hostElPosition.top;
        break;
      case 'bottom':
        targetElPosition.top = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
        break;
      case 'left':
        targetElPosition.left = hostElPosition.left;
        break;
      case 'right':
        targetElPosition.left = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
        break;
      case 'center':
        if (placementPrimary === 'top' || placementPrimary === 'bottom') {
          targetElPosition.left = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
        } else {
          targetElPosition.top = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
        }
        break;
    }

    targetElPosition.top = Math.round(targetElPosition.top);
    targetElPosition.bottom = Math.round(targetElPosition.bottom);
    targetElPosition.left = Math.round(targetElPosition.left);
    targetElPosition.right = Math.round(targetElPosition.right);

    return targetElPosition;
  }
}
// Migrated from
// https://github.com/angular-ui/bootstrap/blob/master/src/position/position.js
export class PositioningAngularUI {
  /**
   * Used by scrollbarWidth() function to cache scrollbar's width.
   * Do not access this variable directly, use scrollbarWidth() instead.
   */
  private SCROLLBAR_WIDTH;
  /**
   * scrollbar on body and html element in IE and Edge overlay
   * content and should be considered 0 width.
   */
  private BODY_SCROLLBAR_WIDTH;
  private OVERFLOW_REGEX = {
    normal: /(auto|scroll)/,
    hidden: /(auto|scroll|hidden)/
  };
  private PLACEMENT_REGEX = {
    auto: /\s?auto?\s?/i,
    primary: /^(top|bottom|left|right)$/,
    secondary: /^(top|bottom|left|right|center)$/,
    vertical: /^(top|bottom)$/
  };
  private BODY_REGEX = /(HTML|BODY)/;

  private documentElement: HTMLElement = document.documentElement; // $document[0].documentElement

  // from $window angular service
  // this.pageXOffset
  private get pageXOffset() : number {
    return window.pageXOffset;
  }
  // this.pageYOffset
  private get pageYOffset() : number {
    return window.pageYOffset;
  }
  // this.innerWidth
  private get windowInnerWidth() : number {
    return window.innerWidth;
  }
  // $window.getComputedStyle(el)
  getComputedStyle(element: HTMLElement): any {
    return window.getComputedStyle(element);
  }

  /**
   * Provides a parsed number for a style property.  Strips
   * units and casts invalid numbers to 0.
   *
   * @param {string} value - The style value to parse.
   *
   * @returns {number} A valid number.
   */
  parseStyle(value) {
    value = parseFloat(value);
    return isFinite(value) ? value : 0;
  }



  clientRect(obj: any): ClientRect {
    if (isDefined(obj.width) && isDefined(obj.height)) {
      return {
        ...obj,
        right: obj.left + obj.width,
        bottom: obj.top + obj.height
      }
    }
    if (isDefined(obj.right) && isDefined(obj.bottom)) {
      return {
        ...obj,
        width: Math.abs(obj.right - obj.left),
        height: Math.abs(obj.bottom - obj.top)
      }
    }
  }

  /**
   * Provides the closest positioned ancestor.
   *
   * @param {element} element - The element to get the offest parent for.
   *
   * @returns {element} The closest positioned ancestor.
   */
  offsetParent(elem) {
    // elem = this.getRawNode(elem);

    var offsetParent = elem.offsetParent || this.documentElement;

    const isStaticPositioned = (el) => {
      return (this.getComputedStyle(el).position || 'static') === 'static';
    }

    while (offsetParent && offsetParent !== this.documentElement && isStaticPositioned(offsetParent)) {
      offsetParent = offsetParent.offsetParent;
    }

    return offsetParent || this.documentElement;
  }

  /**
   * Provides the scrollbar width, concept from TWBS measureScrollbar()
   * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
   * In IE and Edge, scollbar on body and html element overlay and should
   * return a width of 0.
   *
   * @returns {number} The width of the browser scollbar.
   */
  scrollbarWidth(isBody: boolean) {
    if (isBody) {
      if (!isDefined(this.BODY_SCROLLBAR_WIDTH)) {
        var bodyElem = document.querySelector('body');
        bodyElem.style.overflow = 'scroll !important';
        this.BODY_SCROLLBAR_WIDTH = this.windowInnerWidth - bodyElem[0].clientWidth;
        this.BODY_SCROLLBAR_WIDTH = isFinite(this.BODY_SCROLLBAR_WIDTH) ? this.BODY_SCROLLBAR_WIDTH : 0;
        bodyElem.style.overflow = '';
      }
      return this.BODY_SCROLLBAR_WIDTH;
    }

    if (!isDefined(this.SCROLLBAR_WIDTH)) {
      var scrollElem = document.createElement('div');
      // $document.find('body').append(scrollElem);
      scrollElem.style.overflow = 'scroll !important';
      this.documentElement.appendChild(scrollElem);
      this.SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
      this.SCROLLBAR_WIDTH = isFinite(this.SCROLLBAR_WIDTH) ? this.SCROLLBAR_WIDTH : 0;
      scrollElem.remove();
    }

    return this.SCROLLBAR_WIDTH;
  }

  /**
   * Provides the padding required on an element to replace the scrollbar.
   *
   * @returns {object} An object with the following properties:
   *   <ul>
   *     <li>**scrollbarWidth**: the width of the scrollbar</li>
   *     <li>**widthOverflow**: whether the the width is overflowing</li>
   *     <li>**right**: the amount of right padding on the element needed to replace the scrollbar</li>
   *     <li>**rightOriginal**: the amount of right padding currently on the element</li>
   *     <li>**heightOverflow**: whether the the height is overflowing</li>
   *     <li>**bottom**: the amount of bottom padding on the element needed to replace the scrollbar</li>
   *     <li>**bottomOriginal**: the amount of bottom padding currently on the element</li>
   *   </ul>
   */
  scrollbarPadding(element: HTMLElement): any {
    // element = this.getRawNode(element);

    var elementStyle = this.getComputedStyle(element);
    var paddingRight = this.parseStyle(elementStyle.paddingRight);
    var paddingBottom = this.parseStyle(elementStyle.paddingBottom);
    var scrollParent = this.scrollParent(element, false, true);
    var scrollbarWidth = this.scrollbarWidth(this.BODY_REGEX.test(scrollParent.tagName));

    return {
      scrollbarWidth: scrollbarWidth,
      widthOverflow: scrollParent.scrollWidth > scrollParent.clientWidth,
      right: paddingRight + scrollbarWidth,
      originalRight: paddingRight,
      heightOverflow: scrollParent.scrollHeight > scrollParent.clientHeight,
      bottom: paddingBottom + scrollbarWidth,
      originalBottom: paddingBottom
    };
  }

  /**
   * Checks to see if the element is scrollable.
   *
   * @param {element} elem - The element to check.
   * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
   *   default is false.
   *
   * @returns {boolean} Whether the element is scrollable.
   */
  isScrollable(element, includeHidden) {
    // element = this.getRawNode(element);

    var overflowRegex = includeHidden ? this.OVERFLOW_REGEX.hidden : this.OVERFLOW_REGEX.normal;
    var elementStyle = this.getComputedStyle(element);
    return overflowRegex.test(elementStyle.overflow + elementStyle.overflowY + elementStyle.overflowX);
  }

  /**
   * Provides the closest scrollable ancestor.
   * A port of the jQuery UI scrollParent method:
   * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
   *
   * @param {element} elem - The element to find the scroll parent of.
   * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
   *   default is false.
   * @param {boolean=} [includeSelf=false] - Should the element being passed be
   * included in the scrollable llokup.
   *
   * @returns {element} A HTML element.
   */
  scrollParent(element: HTMLElement, includeHidden?: boolean, includeSelf?: boolean) {
    // element = this.getRawNode(element);

    var overflowRegex = includeHidden ? this.OVERFLOW_REGEX.hidden : this.OVERFLOW_REGEX.normal;
    var documentEl = this.documentElement;
    var elementStyle = this.getComputedStyle(element);
    if (includeSelf && overflowRegex.test(elementStyle.overflow + elementStyle.overflowY + elementStyle.overflowX)) {
      return element;
    }
    var excludeStatic = elementStyle.position === 'absolute';
    var scrollParent = element.parentElement || documentEl;

    if (scrollParent === documentEl || elementStyle.position === 'fixed') {
      return documentEl;
    }

    while (scrollParent.parentElement && scrollParent !== documentEl) {
      var spStyle = this.getComputedStyle(scrollParent);
      if (excludeStatic && spStyle.position !== 'static') {
        excludeStatic = false;
      }

      if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
        break;
      }
      scrollParent = scrollParent.parentElement;
    }

    return scrollParent;
  }

  /**
   * Provides read-only equivalent of jQuery's position function:
   * http://api.jquery.com/position/ - distance to closest positioned
   * ancestor.  Does not account for margins by default like jQuery position.
   *
   * @param {element} elem - The element to caclulate the position on.
   * @param {boolean=} [includeMargins=false] - Should margins be accounted
   * for, default is false.
   *
   * @returns {object} An object with the following properties:
   *   <ul>
   *     <li>**width**: the width of the element</li>
   *     <li>**height**: the height of the element</li>
   *     <li>**top**: distance to top edge of offset parent</li>
   *     <li>**left**: distance to left edge of offset parent</li>
   *   </ul>
   */
  position(element: HTMLElement, includeMagins?: boolean):ClientRect  {
    // elem = this.getRawNode(elem);

    const elementOffset = this.offset(element);
    if (includeMagins) {
      const elementStyle = this.getComputedStyle(element);
      elementOffset.top -= this.parseStyle(elementStyle.marginTop);
      elementOffset.left -= this.parseStyle(elementStyle.marginLeft);
    }
    const parent = this.offsetParent(element);
    var parentOffset = {top: 0, left: 0};

    if (parent !== this.documentElement) {
      parentOffset = this.offset(parent);
      parentOffset.top += parent.clientTop - parent.scrollTop;
      parentOffset.left += parent.clientLeft - parent.scrollLeft;
    }

    return this.clientRect({
      width: Math.round(isNumber(elementOffset.width) ? elementOffset.width : element.offsetWidth),
      height: Math.round(isNumber(elementOffset.height) ? elementOffset.height : element.offsetHeight),
      top: Math.round(elementOffset.top - parentOffset.top),
      left: Math.round(elementOffset.left - parentOffset.left)
    });
  }

  /**
   * Provides read-only equivalent of jQuery's offset function:
   * http://api.jquery.com/offset/ - distance to viewport.  Does
   * not account for borders, margins, or padding on the body
   * element.
   *
   * @param {element} elem - The element to calculate the offset on.
   *
   * @returns {object} An object with the following properties:
   *   <ul>
   *     <li>**width**: the width of the element</li>
   *     <li>**height**: the height of the element</li>
   *     <li>**top**: distance to top edge of viewport</li>
   *     <li>**right**: distance to bottom edge of viewport</li>
   *   </ul>
   */
  offset(element): ClientRect {
    // elem = this.getRawNode(elem);

    var elementBCR = element.getBoundingClientRect();

    return this.clientRect({
      width: Math.round(isNumber(elementBCR.width) ? elementBCR.width : element.offsetWidth),
      height: Math.round(isNumber(elementBCR.height) ? elementBCR.height : element.offsetHeight),
      top: Math.round(elementBCR.top + (this.pageYOffset || this.documentElement.scrollTop)),
      left: Math.round(elementBCR.left + (this.pageXOffset || this.documentElement.scrollLeft))
    });
  }

  /**
   * Provides offset distance to the closest scrollable ancestor
   * or viewport.  Accounts for border and scrollbar width.
   *
   * Right and bottom dimensions represent the distance to the
   * respective edge of the viewport element.  If the element
   * edge extends beyond the viewport, a negative value will be
   * reported.
   *
   * @param {element} elem - The element to get the viewport offset for.
   * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
   * of the first scrollable element, default is false.
   * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
   * be accounted for, default is true.
   *
   * @returns {object} An object with the following properties:
   *   <ul>
   *     <li>**top**: distance to the top content edge of viewport element</li>
   *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
   *     <li>**left**: distance to the left content edge of viewport element</li>
   *     <li>**right**: distance to the right content edge of viewport element</li>
   *   </ul>
   */
  viewportOffset(element: HTMLElement, useDocument: boolean, includePadding?: boolean): ClientRect {
    // elem = this.getRawNode(elem);
    includePadding = includePadding !== false ? true : false;

    var elemBCR = element.getBoundingClientRect();
    var offsetBCR = {top: 0, left: 0, bottom: 0, right: 0};

    var offsetParent = useDocument ? this.documentElement : this.scrollParent(element);
    var offsetParentBCR = offsetParent.getBoundingClientRect();

    offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
    offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;
    if (offsetParent === this.documentElement) {
      offsetBCR.top += this.pageYOffset;
      offsetBCR.left += this.pageXOffset;
    }
    offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
    offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

    if (includePadding) {
      var offsetParentStyle = this.getComputedStyle(offsetParent);
      offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
      offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
      offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
      offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
    }

    return this.clientRect({
      top: Math.round(elemBCR.top - offsetBCR.top),
      bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
      left: Math.round(elemBCR.left - offsetBCR.left),
      right: Math.round(offsetBCR.right - elemBCR.right)
    });
  }

  /**
   * Provides an array of placement values parsed from a placement string.
   * Along with the 'auto' indicator, supported placement strings are:
   *   <ul>
   *     <li>top: element on top, horizontally centered on host element.</li>
   *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
   *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
   *     <li>bottom: element on bottom, horizontally centered on host element.</li>
   *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
   *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
   *     <li>left: element on left, vertically centered on host element.</li>
   *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
   *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
   *     <li>right: element on right, vertically centered on host element.</li>
   *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
   *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
   *   </ul>
   * A placement string with an 'auto' indicator is expected to be
   * space separated from the placement, i.e: 'auto bottom-left'  If
   * the primary and secondary placement values do not match 'top,
   * bottom, left, right' then 'top' will be the primary placement and
   * 'center' will be the secondary placement.  If 'auto' is passed, true
   * will be returned as the 3rd value of the array.
   *
   * @param {string} placement - The placement string to parse.
   *
   * @returns {array} An array with the following values
   * <ul>
   *   <li>**[0]**: The primary placement.</li>
   *   <li>**[1]**: The secondary placement.</li>
   *   <li>**[2]**: If auto is passed: true, else undefined.</li>
   * </ul>
   */
  parsePlacement(placement: string): { placement: string[], auto: boolean } {
    var autoPlace = this.PLACEMENT_REGEX.auto.test(placement);
    if (autoPlace) {
      placement = placement.replace(this.PLACEMENT_REGEX.auto, '');
    }

    var result = placement.split('-');

    result[0] = result[0] || 'top';
    if (!this.PLACEMENT_REGEX.primary.test(result[0])) {
      result[0] = 'top';
    }

    result[1] = result[1] || 'center';
    if (!this.PLACEMENT_REGEX.secondary.test(result[1])) {
      result[1] = 'center';
    }

    return { placement: result, auto: autoPlace };
  }
  /**
   * Provides coordinates for an element to be positioned relative to
   * another element.  Passing 'auto' as part of the placement parameter
   * will enable smart placement - where the element fits. i.e:
   * 'auto left-top' will check to see if there is enough space to the left
   * of the hostElem to fit the targetElem, if not place right (same for secondary
   * top placement).  Available space is calculated using the viewportOffset
   * function.
   *
   * @param {element} hostElem - The element to position against.
   * @param {element} targetElement - The element to position.
   * @param {string=} [placement=top] - The placement for the targetElem,
   *   default is 'top'. 'center' is assumed as secondary placement for
   *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
   *   <ul>
   *     <li>top</li>
   *     <li>top-right</li>
   *     <li>top-left</li>
   *     <li>bottom</li>
   *     <li>bottom-left</li>
   *     <li>bottom-right</li>
   *     <li>left</li>
   *     <li>left-top</li>
   *     <li>left-bottom</li>
   *     <li>right</li>
   *     <li>right-top</li>
   *     <li>right-bottom</li>
   *   </ul>
   * @param {boolean=} [appendToBody=false] - Should the top and left values returned
   *   be calculated from the body element, default is false.
   *
   * @returns {object} An object with the following properties:
   *   <ul>
   *     <li>**top**: Value for targetElement top.</li>
   *     <li>**left**: Value for targetElement left.</li>
   *     <li>**placement**: The resolved placement.</li>
   *   </ul>
   */
  positionElements(hostElement: HTMLElement, targetElement: HTMLElement, placementString: string, appendToBody?: boolean) {
    // hostElem = this.getRawNode(hostElement);
    // targetElement = this.getRawNode(targetElement);

    // need to read from prop to support tests.
    // TODO: check prop method
    const targetWidth = targetElement.offsetWidth;
    const targetHeight = targetElement.offsetHeight;

    var { placement, auto } = this.parsePlacement(placementString);

    const hostElementPos = appendToBody ? this.offset(hostElement) : this.position(hostElement);
    const targetElementPos = {top: 0, left: 0, placement: ''};
    const targetElementStyle = this.getComputedStyle(targetElement);
    const adjustedSize = {
      width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElementStyle.marginLeft) + this.parseStyle(targetElementStyle.marginRight))),
      height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElementStyle.marginTop) + this.parseStyle(targetElementStyle.marginBottom)))
    };

    if (auto) {
      const viewportOffset = this.viewportOffset(hostElement, appendToBody);

      placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' :
                      placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' :
                      placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' :
                      placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' :
                      placement[0];

      placement[1] = placement[1] === 'top' && adjustedSize.height - hostElementPos.height > viewportOffset.bottom && adjustedSize.height - hostElementPos.height <= viewportOffset.top ? 'bottom' :
                      placement[1] === 'bottom' && adjustedSize.height - hostElementPos.height > viewportOffset.top && adjustedSize.height - hostElementPos.height <= viewportOffset.bottom ? 'top' :
                      placement[1] === 'left' && adjustedSize.width - hostElementPos.width > viewportOffset.right && adjustedSize.width - hostElementPos.width <= viewportOffset.left ? 'right' :
                      placement[1] === 'right' && adjustedSize.width - hostElementPos.width > viewportOffset.left && adjustedSize.width - hostElementPos.width <= viewportOffset.right ? 'left' :
                      placement[1];

      if (placement[1] === 'center') {
        if (this.PLACEMENT_REGEX.vertical.test(placement[0])) {
          var xOverflow = hostElementPos.width / 2 - targetWidth / 2;
          if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElementPos.width <= viewportOffset.right) {
            placement[1] = 'left';
          } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElementPos.width <= viewportOffset.left) {
            placement[1] = 'right';
          }
        } else {
          var yOverflow = hostElementPos.height / 2 - adjustedSize.height / 2;
          if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElementPos.height <= viewportOffset.bottom) {
            placement[1] = 'top';
          } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElementPos.height <= viewportOffset.top) {
            placement[1] = 'bottom';
          }
        }
      }
    }

    switch (placement[0]) {
      case 'top':
        targetElementPos.top = hostElementPos.top - adjustedSize.height;
        break;
      case 'bottom':
        targetElementPos.top = hostElementPos.top + hostElementPos.height;
        break;
      case 'left':
        targetElementPos.left = hostElementPos.left - adjustedSize.width;
        break;
      case 'right':
        targetElementPos.left = hostElementPos.left + hostElementPos.width;
        break;
    }

    switch (placement[1]) {
      case 'top':
        targetElementPos.top = hostElementPos.top;
        break;
      case 'bottom':
        targetElementPos.top = hostElementPos.top + hostElementPos.height - adjustedSize.height;
        break;
      case 'left':
        targetElementPos.left = hostElementPos.left;
        break;
      case 'right':
        targetElementPos.left = hostElementPos.left + hostElementPos.width - adjustedSize.width;
        break;
      case 'center':
        if (this.PLACEMENT_REGEX.vertical.test(placement[0])) {
          targetElementPos.left = hostElementPos.left + hostElementPos.width / 2 - adjustedSize.width / 2;
        } else {
          targetElementPos.top = hostElementPos.top + hostElementPos.height / 2 - adjustedSize.height / 2;
        }
        break;
    }

    targetElementPos.top = Math.round(targetElementPos.top);
    targetElementPos.left = Math.round(targetElementPos.left);
    targetElementPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];

    console.log(targetElementPos);

    return targetElementPos;
  }

}


export const positionService = new PositioningAngularUI();
export const positionServiceOriginal = new Positioning();
export function positionElements(
    hostElement: HTMLElement, targetElement: HTMLElement, placement: string, appendToBody?: boolean){
  const position = positionServiceOriginal.positionElements(hostElement, targetElement, placement, appendToBody);

  targetElement.style.top = `${position.top}px`;
  targetElement.style.left = `${position.left}px`;
}
