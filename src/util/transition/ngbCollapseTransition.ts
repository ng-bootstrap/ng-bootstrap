import {NgbTransitionOptions, NgbTransitionDefReturn} from './ngbTransition';
import {reflow} from '../util';

const collapseClass = 'collapse';
const collapsingClass = 'collapsing';
const showClass = 'show';
const dataMaxHeight = 'data-max-height';

export const NgbCollapsingTransition =
    (panelElement: HTMLElement, options: NgbTransitionOptions = {}): NgbTransitionDefReturn => {
      const direction = options.data.direction;
      const classList = panelElement.classList;
      if (options.animation) {
        let maxHeight = panelElement.getAttribute(dataMaxHeight);
        if (!maxHeight) {
          // No transition is running
          const hasShown = classList.contains(showClass);
          if (!hasShown) {
            classList.add(showClass);
          }
          panelElement.style.height = '';
          maxHeight = panelElement.getBoundingClientRect().height + 'px';
          panelElement.setAttribute(dataMaxHeight, maxHeight);
          if (!hasShown) {
            classList.remove(showClass);
          }

          // Fix the height before starting the animation
          panelElement.style.height = direction !== 'show' ? maxHeight : '0px';

          // Remove the collapse classes to let the nbgAnimationEngine works by itself
          classList.remove(collapseClass);
          classList.remove(collapsingClass);
          classList.remove(showClass);

          reflow(panelElement);

          // Start the animation
          classList.add(collapsingClass);
        }

        // Start or revert the transition
        panelElement.style.height = direction === 'show' ? maxHeight : '0px';
      }
      return {
        elements: panelElement,
        end: () => {
          // Togle classes
          classList.remove(collapsingClass);
          classList.add(collapseClass);
          if (direction === 'show') {
            classList.add(showClass);
          } else {
            classList.remove(showClass);
          }

          panelElement.removeAttribute(dataMaxHeight);
          panelElement.style.height = '';
        }
      };
    };
