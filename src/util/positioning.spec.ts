import {Positioning} from './positioning';

describe('Positioning', () => {
  const positioning = new Positioning();
  const documentMargin = document.documentElement.style.margin;
  const bodyMargin = document.body.style.margin;
  const bodyHeight = document.body.style.height;
  const bodyWidth = document.body.style.width;

  function getStyleValue(value: number): string {
    if (value) {
      return `${value}px`;
    } else {
      return '0';
    }
  }

  function createElement(
      height: number, width: number, marginTop: number, marginLeft: number, marginBottom: number,
      marginRight: number): HTMLElement {
    let element = document.createElement('div');
    element.style.display = 'inline-block';
    element.style.height = getStyleValue(height);
    element.style.width = getStyleValue(width);
    element.style.marginTop = getStyleValue(marginTop);
    element.style.marginLeft = getStyleValue(marginLeft);
    element.style.marginBottom = getStyleValue(marginBottom);
    element.style.marginRight = getStyleValue(marginRight);

    return element;
  }

  let containerElement = createElement(500, 500, 0, 0, 0, 0);
  document.body.appendChild(containerElement);
  let element = createElement(200, 300, 100, 150, 100, 150);
  containerElement.appendChild(element);
  let targetElement = createElement(50, 100, 10, 20, 10, 20);
  containerElement.appendChild(targetElement);

  document.documentElement.style.margin = '0';
  document.body.style.margin = '0';
  document.body.style.height = '1000px';
  document.body.style.width = '1000px';

  it('should calculate the element offset', () => {
    let position = positioning.offset(element);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(100);
    expect(position.bottom).toBe(300);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);
  });

  it('should calculate the element offset when scrolled', () => {
    let origHeight = containerElement.style.height;
    let origWidth = containerElement.style.width;
    let origOverflow = containerElement.style.overflow;

    containerElement.style.height = '100px';
    containerElement.style.width = '150px';
    containerElement.style.overflow = 'auto';

    let scrollTop = 50;
    let scrollLeft = 60;
    containerElement.scrollTop = scrollTop;
    containerElement.scrollLeft = scrollLeft;

    let position = positioning.offset(element);

    expect(position.top).toBe(100 - scrollTop);
    expect(position.bottom).toBe(300 - scrollTop);
    expect(position.left).toBe(150 - scrollLeft);
    expect(position.right).toBe(450 - scrollLeft);

    containerElement.scrollTop = 0;
    containerElement.scrollLeft = 0;

    containerElement.style.height = origHeight;
    containerElement.style.width = origWidth;
    containerElement.style.overflow = origOverflow;
  });

  it('should calculate the element position including margin', () => {
    let position = positioning.position(element, true, true);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(0);
    expect(position.bottom).toBe(400);
    expect(position.left).toBe(0);
    expect(position.right).toBe(600);
  });

  it('should calculate the element position excluding margin', () => {
    let position = positioning.position(element, true, false);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(100);
    expect(position.bottom).toBe(300);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);
  });

  it('should calculate the element position when scrolled', () => {
    let origHeight = containerElement.style.height;
    let origWidth = containerElement.style.width;
    let origOverflow = containerElement.style.overflow;

    containerElement.style.height = '100px';
    containerElement.style.width = '150px';
    containerElement.style.overflow = 'auto';

    let scrollTop = 50;
    let scrollLeft = 60;
    containerElement.scrollTop = scrollTop;
    containerElement.scrollLeft = scrollLeft;

    let position = positioning.position(element, true, false);

    expect(position.top).toBe(100 - scrollTop);
    expect(position.bottom).toBe(300 - scrollTop);
    expect(position.left).toBe(150 - scrollLeft);
    expect(position.right).toBe(450 - scrollLeft);

    containerElement.scrollTop = 0;
    containerElement.scrollLeft = 0;

    containerElement.style.height = origHeight;
    containerElement.style.width = origWidth;
    containerElement.style.overflow = origOverflow;
  });

  it('should calculate the element position on positioned ancestor', () => {
    let childElement = createElement(100, 150, 50, 75, 0, 0);

    element.style.position = 'relative';
    element.appendChild(childElement);

    let position = positioning.position(childElement, true, false);

    expect(position.top).toBe(50);
    expect(position.bottom).toBe(150);
    expect(position.left).toBe(75);
    expect(position.right).toBe(225);

    element.style.position = '';
    element.removeChild(childElement);
  });

  it('should position the element top-left', () => {
    let position = positioning.positionElements(element, targetElement, 'top-left');

    expect(position.top).toBe(50);
    expect(position.left).toBe(150);
  });

  it('should position the element top-center', () => {
    let position = positioning.positionElements(element, targetElement, 'top');

    expect(position.top).toBe(50);
    expect(position.left).toBe(250);
  });

  it('should position the element top-right', () => {
    let position = positioning.positionElements(element, targetElement, 'top-right');

    expect(position.top).toBe(50);
    expect(position.left).toBe(450);
  });

  it('should position the element bottom-left', () => {
    let position = positioning.positionElements(element, targetElement, 'bottom-left');

    expect(position.top).toBe(300);
    expect(position.left).toBe(150);
  });

  it('should position the element bottom-center', () => {
    let position = positioning.positionElements(element, targetElement, 'bottom');

    expect(position.top).toBe(300);
    expect(position.left).toBe(250);
  });

  it('should position the element bottom-right', () => {
    let position = positioning.positionElements(element, targetElement, 'bottom-right');

    expect(position.top).toBe(300);
    expect(position.left).toBe(450);
  });

  it('should position the element left-top', () => {
    let position = positioning.positionElements(element, targetElement, 'left-top');

    expect(position.top).toBe(100);
    expect(position.left).toBe(50);
  });

  it('should position the element left-center', () => {
    let position = positioning.positionElements(element, targetElement, 'left');

    expect(position.top).toBe(175);
    expect(position.left).toBe(50);
  });

  it('should position the element left-bottom', () => {
    let position = positioning.positionElements(element, targetElement, 'left-bottom');

    expect(position.top).toBe(300);
    expect(position.left).toBe(50);
  });

  it('should position the element right-top', () => {
    let position = positioning.positionElements(element, targetElement, 'right-top');

    expect(position.top).toBe(100);
    expect(position.left).toBe(450);
  });

  it('should position the element right-center', () => {
    let position = positioning.positionElements(element, targetElement, 'right');

    expect(position.top).toBe(175);
    expect(position.left).toBe(450);
  });

  it('should position the element right-bottom', () => {
    let position = positioning.positionElements(element, targetElement, 'right-bottom');

    expect(position.top).toBe(300);
    expect(position.left).toBe(450);
  });

  it('cleanUp', () => {
    document.body.removeChild(containerElement);
    document.documentElement.style.margin = documentMargin;
    document.body.style.margin = bodyMargin;
    document.body.style.height = bodyHeight;
    document.body.style.width = bodyWidth;
  });
});
