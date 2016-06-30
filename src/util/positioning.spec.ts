import {it, describe, expect, beforeEach, afterEach} from '@angular/core/testing';

import {Positioning} from './positioning';

describe('Positioning', () => {
  const positioning = new Positioning();
  const documentMargin = document.documentElement.style.margin;
  const bodyMargin = document.body.style.margin;
  const bodyHeight = document.body.style.height;
  const bodyWidth = document.body.style.width;

  function createElement(height: number, width: number, marginTop: number, marginLeft: number): HTMLElement {
    let element = document.createElement('div');
    element.style.display = 'inline-block';
    element.style.height = height + 'px';
    element.style.width = width + 'px';
    element.style.marginTop = marginTop + 'px';
    element.style.marginLeft = marginLeft + 'px';

    return element;
  }

  let element = createElement(200, 300, 100, 150);
  document.body.appendChild(element);
  let targetElement = createElement(50, 100, 10, 20);
  document.body.appendChild(targetElement);

  document.documentElement.style.margin = '0';
  document.body.style.margin = '0';
  document.body.style.height = '2000px';
  document.body.style.width = '2000px';

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
    document.documentElement.scrollTop = 1000;
    document.documentElement.scrollLeft = 1000;

    let position = positioning.offset(element);

    expect(position.top).toBe(100);
    expect(position.bottom).toBe(300);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  });

  it('should calculate the element position', () => {
    let position = positioning.position(element);

    expect(position.height).toBe(200);
    expect(position.width).toBe(300);
    expect(position.top).toBe(100);
    expect(position.bottom).toBe(300);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);
  });

  it('should calculate the element position when scrolled', () => {
    document.documentElement.scrollTop = 1000;
    document.documentElement.scrollLeft = 1000;

    let position = positioning.position(element);

    expect(position.top).toBe(100);
    expect(position.bottom).toBe(300);
    expect(position.left).toBe(150);
    expect(position.right).toBe(450);

    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  });

  it('should calculate the element position on positioned ancestor', () => {
    let childElement = createElement(100, 150, 50, 75);

    element.style.position = 'relative';
    element.appendChild(childElement);

    let position = positioning.position(childElement);

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
    document.body.removeChild(element);
    document.body.removeChild(targetElement);
    document.documentElement.style.margin = documentMargin;
    document.body.style.margin = bodyMargin;
    document.body.style.height = bodyHeight;
    document.body.style.width = bodyWidth;
  });
});
