import {NgbTransitionStartFn} from '../util/transition/ngbTransition';
import {reflow} from '../util/util';

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
  LEFT = 'left',
  RIGHT = 'right'
}

export interface NgbCarouselCtx { direction: 'left' | 'right'; }

const isAnimated = ({classList}) => {
  return classList.contains('carousel-item-left') || classList.contains('carousel-item-right');
};

const removeDirectionClasses = ({classList}) => {
  classList.remove('carousel-item-left');
  classList.remove('carousel-item-right');
};

const removeClasses = ({classList}) => {
  removeDirectionClasses({classList});
  classList.remove('carousel-item-prev');
  classList.remove('carousel-item-next');
};

export const ngbCarouselTransitionIn: NgbTransitionStartFn<NgbCarouselCtx> =
    (element: HTMLElement, {direction}: NgbCarouselCtx) => {
      const {classList} = element;
      if (isAnimated(element)) {
        // Revert the transition
        removeDirectionClasses(element);
      } else {
        // For the 'in' transition, a 'pre-class' is applied to the element to ensure its visibility
        classList.add('carousel-item-' + (direction === NgbSlideEventDirection.LEFT ? 'next' : 'prev'));
        reflow(element);
        classList.add('carousel-item-' + direction);
      }

      return () => {
        removeClasses(element);
        classList.add('active');
      };
    };

export const ngbCarouselTransitionOut: NgbTransitionStartFn<NgbCarouselCtx> =
    (element: HTMLElement, {direction}: NgbCarouselCtx) => {
      const {classList} = element;
      //  direction is left or right, depending on the way the slide goes out.
      if (isAnimated(element)) {
        // Revert the transition
        removeDirectionClasses(element);
      } else {
        classList.add('carousel-item-' + direction);
      }

      return () => {
        removeClasses(element);
        classList.remove('active');
      };
    };
