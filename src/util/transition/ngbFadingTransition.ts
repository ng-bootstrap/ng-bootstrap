import {NgbTransitionOptions, NgbTransitionDefReturn} from './ngbTransition';
import {reflow} from '../util';

export const NgbNavFadingTransition = (node: HTMLElement, options: NgbTransitionOptions): NgbTransitionDefReturn => {
  const animation = options.animation;
  let end;
  const mustBeHidden = options.data.direction !== 'show';
  const classList = node.classList;
  if (mustBeHidden) {
    classList.remove('show');
    end = () => { classList.remove('active'); };
  } else {
    classList.add('active');
    if (animation) {
      reflow(node);
    }
    classList.add('show');
  }
  return {elements: animation ? node : null, end};
};

export const NgbAlertFadingTransition =
    (node: HTMLElement, options: NgbTransitionOptions = {}): NgbTransitionDefReturn => {
      node.classList.remove('show');
      return {elements: node};
    };

const _showClass = 'show';
export const NgbModalFadingTransition =
    (node: HTMLElement, options: NgbTransitionOptions = {}): NgbTransitionDefReturn => {
      const classList = node.classList;
      if (classList.contains(_showClass)) {
        classList.remove('show');
      } else {
        reflow(node);
        classList.add('show');
      }
      return ({ elements: [node, node.querySelector('div.modal-dialog')] } as NgbTransitionDefReturn);
    };

export const NgbPopupFadingTransition = (node: HTMLElement, options: NgbTransitionOptions = {}) => {
  let addClass;
  const showElement = options.data.showElement;
  const classList = node.classList;
  if (showElement != null) {
    addClass = showElement === true;
  } else {
    addClass = !classList.contains(_showClass);
  }

  if (addClass) {
    classList.add('show');
  } else {
    classList.remove('show');
  }

  return {elements: node};
};
