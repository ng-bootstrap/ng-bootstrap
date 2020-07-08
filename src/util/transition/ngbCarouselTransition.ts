import {NgbTransitionStartFn} from './ngbTransition';
import {reflow} from '../util';

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface NgbCarouselCtx { direction: 'left' | 'right'; }

const isAnimated = (classList) => {
  return classList.contains('carousel-item-left') || classList.contains('carousel-item-right');
};

const removeDirectionClasses = (classList) => {
  console.log('removeDirectionClasses');
  classList.remove('carousel-item-left');
  classList.remove('carousel-item-right');
};

const removeClasses = (classList) => {
  console.log('removeClasses');
  removeDirectionClasses(classList);
  classList.remove('carousel-item-prev');
  classList.remove('carousel-item-next');
};

export const ngbCarouselTransitionIn: NgbTransitionStartFn<NgbCarouselCtx> =
    (element: HTMLElement, {direction}: NgbCarouselCtx) => {
      const {classList} = element;
      if (isAnimated(classList)) {
        // Revert the transition
        removeDirectionClasses(classList);
      } else {
        // For the 'in' transition, a 'pre-class' is applied to the element to ensure its visibility
        console.log(
            'ngbCarouselTransitionIn, add previous/next class', element.id,
            'carousel-item-' + (direction === NgbSlideEventDirection.LEFT ? 'next' : 'prev'));
        classList.add('carousel-item-' + (direction === NgbSlideEventDirection.LEFT ? 'next' : 'prev'));
        reflow(element);
        console.log('ngbCarouselTransitionIn, add direction class', 'carousel-item-' + direction);
        classList.add('carousel-item-' + direction);
      }

      return () => {
        removeClasses(classList);
        console.log('ngbCarouselTransitionIn, add active class', element.id);
        classList.add('active');
      };
    };

export const ngbCarouselTransitionOut: NgbTransitionStartFn<NgbCarouselCtx> =
    (element: HTMLElement, {direction}: NgbCarouselCtx) => {
      //  direction is left or right, depending on the way the slide goes out.
      if (isAnimated(element.classList)) {
        // Revert the transition
        removeDirectionClasses(element.classList);
      } else {
        console.log('ngbCarouselTransitionOut, add direction class', element.id, 'carousel-item-' + direction);
        element.classList.add('carousel-item-' + direction);
      }

      return () => {
        removeClasses(element.classList);
        console.log('ngbCarouselTransitionOut, remove active class', element.id);
        element.classList.remove('active');
      };
    };
