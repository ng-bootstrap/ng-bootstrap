import {
  arrow,
  createPopperLite,
  flip,
  Instance,
  Modifier,
  Placement as PopperPlacement,
  preventOverflow,
  Options,
} from '@popperjs/core';

const placementSeparator = /\s+/;
const spacesRegExp = /  +/gi;

const startPrimaryPlacement = /^start/;
const endPrimaryPlacement = /^end/;
const startSecondaryPlacement = /-(top|left)$/;
const endSecondaryPlacement = /-(bottom|right)$/;
export function getPopperClassPlacement(placement: Placement): PopperPlacement {
  const newPlacement = placement.replace(startPrimaryPlacement, 'left')
                           .replace(endPrimaryPlacement, 'right')
                           .replace(startSecondaryPlacement, '-start')
                           .replace(endSecondaryPlacement, '-end') as PopperPlacement;
  return newPlacement;
}

const popperStartPrimaryPlacement = /^left/;
const popperEndPrimaryPlacement = /^right/;
const popperStartSecondaryPlacement = /^start/;
const popperEndSecondaryPlacement = /^end/;
export function getBootstrapBaseClassPlacement(baseClass: string, placement: PopperPlacement): string {
  let [primary, secondary] = placement.split('-');
  const newPrimary = primary.replace(popperStartPrimaryPlacement, 'start').replace(popperEndPrimaryPlacement, 'end');
  let classnames = [newPrimary];
  if (secondary) {
    let newSecondary = secondary;
    if (primary === 'left' || primary === 'right') {
      newSecondary =
          newSecondary.replace(popperStartSecondaryPlacement, 'top').replace(popperEndSecondaryPlacement, 'bottom');
    }
    classnames.push(`${newPrimary}-${newSecondary}` as Placement);
  }
  if (baseClass) {
    classnames = classnames.map((classname) => `${baseClass}-${classname}`);
  }
  return classnames.join(' ');
}

/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'start', 'end',
 *   'top-start', 'top-end',
 *   'bottom-start', 'bottom-end',
 *   'start-top', 'start-bottom',
 *   'end-top', 'end-bottom'.
 * */
export function getPopperOptions({placement, baseClass}: PositioningOptions): Partial<Options> {
  let placementVals: Array<Placement> =
      Array.isArray(placement) ? placement : placement.split(placementSeparator) as Array<Placement>;

  // No need to consider left and right here, as start and end are enough, and it is used for 'auto' placement only
  const allowedPlacements = [
    'top', 'bottom', 'start', 'end', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'start-top', 'start-bottom',
    'end-top', 'end-bottom'
  ];

  // replace auto placement with other placements
  let hasAuto = placementVals.findIndex(val => val === 'auto');
  if (hasAuto >= 0) {
    allowedPlacements.forEach(function(obj) {
      if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
        placementVals.splice(hasAuto++, 1, obj as Placement);
      }
    });
  }

  const popperPlacements = placementVals.map((_placement) => { return getPopperClassPlacement(_placement); });

  let mainPlacement = popperPlacements.shift();

  const bsModifier: Partial<Modifier<any, any>> = {
    name: 'bootstrapClasses',
    enabled: !!baseClass,
    phase: 'write',
    fn({state}) {
      const bsClassRegExp = new RegExp(baseClass + '-[a-z]+', 'gi');

      const popperElement: HTMLElement = state.elements.popper as HTMLElement;
      const popperPlacement = state.placement;

      let className = popperElement.className;

      // Remove old bootstrap classes
      className = className.replace(bsClassRegExp, '');

      // Add current placements
      className += ` ${getBootstrapBaseClassPlacement(baseClass !, popperPlacement)}`;

      // Remove multiple spaces
      className = className.trim().replace(spacesRegExp, ' ');

      // Reassign
      popperElement.className = className;
    },
  };

  return {
    placement: mainPlacement,
    modifiers: [
      bsModifier,
      flip,
      preventOverflow,
      arrow,
      {
        enabled: true,
        name: 'flip',
        options: {
          fallbackPlacements: popperPlacements,
        },
      },
      {
        enabled: true,
        name: 'preventOverflow',
        phase: 'main',
        fn: function() {},
      },
    ]
  };
}

export type Placement = 'auto' | 'top' | 'bottom' | 'start' | 'left' | 'end' | 'right' | 'top-start' | 'top-left' |
    'top-end' | 'top-right' | 'bottom-start' | 'bottom-left' | 'bottom-end' | 'bottom-right' | 'start-top' |
    'left-top' | 'start-bottom' | 'left-bottom' | 'end-top' | 'right-top' | 'end-bottom' | 'right-bottom';

export type PlacementArray = Placement | Array<Placement>| string;

interface PositioningOptions {
  hostElement: HTMLElement;
  targetElement: HTMLElement;
  placement: string | Placement | PlacementArray;
  appendToBody?: boolean;
  baseClass?: string;
  updatePopperOptions?: (options: Partial<Options>) => Partial<Options>;
}

function noop(arg) {
  return arg;
}
export function ngbPositioning() {
  let popperInstance: Instance | null = null;

  return {
    createPopper(positioningOption: PositioningOptions) {
      if (!popperInstance) {
        const updatePopperOptions = positioningOption.updatePopperOptions || noop;
        let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
        popperInstance =
            createPopperLite(positioningOption.hostElement, positioningOption.targetElement, popperOptions);
      }
    },
    update() {
      if (popperInstance) {
        popperInstance.update();
      }
    },
    setOptions(positioningOption: PositioningOptions) {
      if (popperInstance) {
        const updatePopperOptions = positioningOption.updatePopperOptions || noop;
        let popperOptions = updatePopperOptions(getPopperOptions(positioningOption));
        popperInstance.setOptions(popperOptions);
      }
    },
    destroy() {
      if (popperInstance) {
        popperInstance.destroy();
        popperInstance = null;
      }
    }
  };
}
