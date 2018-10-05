import {NgbTransitionOptions, NgbTransitionDefReturn} from './ngbTransition';
import {reflow} from '../util';

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
  LEFT = <any>'left',
  RIGHT = <any>'right'
}

const hasDirectionClasses = (classList) => {
  return classList.contains('carousel-item-left') || classList.contains('carousel-item-right');
};

const removeDirectionClasses = (classList) => {
  classList.remove('carousel-item-left');
  classList.remove('carousel-item-right');
};

const clearClasses = (classList) => {
  removeDirectionClasses(classList);
  classList.remove('carousel-item-prev');
  classList.remove('carousel-item-next');
};

export const NgbCarouselTransitionIn =
    (panelElement: HTMLElement, options: NgbTransitionOptions): NgbTransitionDefReturn => {
      const {direction} = options.data;
      const classList = panelElement.classList;
      // For 'in' transition, a 'pre-class' is applied to the element to ensure its visibility
      let visibilityClassname = 'carousel-item-' + (direction === NgbSlideEventDirection.LEFT ? 'next' : 'prev');
      let directionClassname = 'carousel-item-' + direction;
      if (options.animation) {
        const isAnimated = hasDirectionClasses(classList);
        if (isAnimated) {
          // Revert the transition
          removeDirectionClasses(classList);
        } else {
          classList.add(visibilityClassname);
          reflow(panelElement);
          classList.add(directionClassname);
        }
      }

      return {elements: panelElement, end: () => { clearClasses(classList); }};
    };

export const NgbCarouselTransitionOut =
    (panelElement: HTMLElement, options: NgbTransitionOptions): NgbTransitionDefReturn => {
      const {direction} = options.data;
      const classList = panelElement.classList;
      //  direction is left or right, depending on the way the slide goes out.
      const classname = 'carousel-item-' + direction;
      if (options.animation) {
        const isAnimated = hasDirectionClasses(classList);
        if (isAnimated) {
          // Revert the transition
          removeDirectionClasses(classList);
        } else {
          classList.add(classname);
        }
      }

      return {elements: panelElement, end: () => { clearClasses(classList); }};
    };
