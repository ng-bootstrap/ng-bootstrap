import {getBootstrapBaseClassPlacement, getPopperClassPlacement, Placement} from './positioning';
import {Placement as PopperPlacement} from '@popperjs/core';
describe('positioning', () => {

  /**
   * Object of bootstrap classes for the keys, and their corresponding popper ones in the values
   */
  const matchingBootstrapPopperPlacements = {
    'top': 'top',
    'bottom': 'bottom',
    'start': 'left',
    'left': 'left',
    'end': 'right',
    'right': 'right',
    'top-start': 'top-start',
    'top-left': 'top-start',
    'top-end': 'top-end',
    'top-right': 'top-end',
    'bottom-start': 'bottom-start',
    'bottom-left': 'bottom-start',
    'bottom-end': 'bottom-end',
    'bottom-right': 'bottom-end',
    'start-top': 'left-start',
    'left-top': 'left-start',
    'start-bottom': 'left-end',
    'left-bottom': 'left-end',
    'end-top': 'right-start',
    'right-top': 'right-start',
    'end-bottom': 'right-end',
    'right-bottom': 'right-end'
  };

  const matchingPopperBootstrapPlacements = {
    'top': 'top',
    'bottom': 'bottom',
    'left': 'start',
    'right': 'end',
    'top-start': 'top top-start',
    'top-end': 'top top-end',
    'bottom-start': 'bottom bottom-start',
    'bottom-end': 'bottom bottom-end',
    'left-start': 'start start-top',
    'left-end': 'start start-bottom',
    'right-start': 'end end-top',
    'right-end': 'end end-bottom',
  };

  it('should convert bootstrap classes to popper classes', () => {

    for (const[bsClass, popperClass] of Object.entries(matchingBootstrapPopperPlacements)) {
      expect(getPopperClassPlacement(bsClass as Placement)).toBe(popperClass);
    }
  });

  it('should convert popper classes to bootstrap classes', () => {

    for (const[popperClass, bsClass] of Object.entries(matchingPopperBootstrapPlacements)) {
      if (bsClass !== getBootstrapBaseClassPlacement('', popperClass as PopperPlacement)) {
        console.log(
            '(DEBUG)   popperClass', popperClass, bsClass,
            getBootstrapBaseClassPlacement('', popperClass as PopperPlacement));
      }
      expect(getBootstrapBaseClassPlacement('', popperClass as PopperPlacement)).toBe(bsClass);
    }
  });



});
