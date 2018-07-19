import {isDefined} from './util';



interface KeySpecInput {
  name?: string;
  keys: string[];
  code: number;
}

export interface KeySpec {
  name: string;
  key: string;
  keys: string[];
  code: number;
}

const KEY_SPECS_INPUTS: KeySpecInput[] = [
  {               keys: ['Tab'                  ], code:  9},
  {               keys: ['Enter'                ], code: 13},
  {               keys: ['Escape'   , 'Esc'     ], code: 27},
  {name: 'Space', keys: [' '        , 'Spacebar'], code: 32},

  {               keys: ['PageUp'               ], code: 33},
  {               keys: ['PageDown'             ], code: 34},
  {               keys: ['End'                  ], code: 35},
  {               keys: ['Home'                 ], code: 36},

  {               keys: ['ArrowLeft' , 'Left'   ], code: 37},
  {               keys: ['ArrowUp'   , 'Up'     ], code: 38},
  {               keys: ['ArrowRight', 'Right'  ], code: 39},
  {               keys: ['ArrowDown' , 'Down'   ], code: 40}
];

export const KEY_SPECS: KeySpec[] = KEY_SPECS_INPUTS.map(({name, keys, code}: KeySpecInput) => {
  const key = keys[0];

  if (!isDefined(name)) {
    name = key;
  }

  return {name, key, keys, code};
});



export const CODES_TO_SPECS = {};
KEY_SPECS.forEach(spec => CODES_TO_SPECS[spec.code] = spec);

export const KEYS_TO_SPECS = {};
KEY_SPECS.forEach(spec => spec.keys.forEach(key => KEYS_TO_SPECS[key] = spec));

export const NAMES_TO_SPECS = {};
KEY_SPECS.forEach(spec => NAMES_TO_SPECS[spec.name] = spec);



export function getKeySpecFromEvent(event: KeyboardEvent): KeySpec {
  const {key, keyCode, which} = event;

  let spec = null;

  if (isDefined(key)) {
    spec = KEYS_TO_SPECS[key];
  }

  if (!isDefined(spec)) {
    const code = isDefined(keyCode) ? keyCode : isDefined(which) ? which : null;
    if (isDefined(code)) {
      spec = CODES_TO_SPECS[code];
    }
  }

  return spec;
}

export function getKeyPropertyFromEvent(property: string, event: KeyboardEvent): any {
  const spec = getKeySpecFromEvent(event);
  return isDefined(spec) ? spec[property] : null;
}

export function getKey    (event: KeyboardEvent): string { return getKeyPropertyFromEvent('key' , event); }
export function getKeyCode(event: KeyboardEvent): number { return getKeyPropertyFromEvent('code', event); }
export function getKeyName(event: KeyboardEvent): string { return getKeyPropertyFromEvent('name', event); }



export function checkKey(name: string, event: KeyboardEvent): boolean { return getKeyName(event) === name; }


export function isTab   (event: KeyboardEvent): boolean { return checkKey('Tab'   , event); }
export function isEnter (event: KeyboardEvent): boolean { return checkKey('Enter' , event); }
export function isEscape(event: KeyboardEvent): boolean { return checkKey('Escape', event); }
export function isSpace (event: KeyboardEvent): boolean { return checkKey('Space' , event); }


export function isPageUp  (event: KeyboardEvent): boolean { return checkKey('PageUp'  , event); }
export function isPageDown(event: KeyboardEvent): boolean { return checkKey('PageDown', event); }
export function isEnd     (event: KeyboardEvent): boolean { return checkKey('End'     , event); }
export function isHome    (event: KeyboardEvent): boolean { return checkKey('Home'    , event); }


export function isArrowLeft (event: KeyboardEvent): boolean { return checkKey('ArrowLeft' , event); }
export function isArrowUp   (event: KeyboardEvent): boolean { return checkKey('ArrowUp'   , event); }
export function isArrowRight(event: KeyboardEvent): boolean { return checkKey('ArrowRight', event); }
export function isArrowDown (event: KeyboardEvent): boolean { return checkKey('ArrowDown' , event); }



export interface FakeEvent extends Event {
  which: number;
  keyCode: number;
  key: string;
};

export function createKeyboardEvent(input): Event {
  if (!isDefined(input)) {
    input = {};
  }

  let {type, name, options} = input;

  if (!isDefined(type)) {
    type = 'keyup';
  }

  const event = new Event(type, {bubbles: true}) as FakeEvent;

  if (isDefined(name)) {
    const spec = NAMES_TO_SPECS[name];
    if (isDefined(spec)) {
      const {key, code} = spec;
      event.which = code;
      event.keyCode = code;
      event.key = key;
    }
  }

  if (isDefined(options)) {
    Object.assign(event, options);
  }

  return event;
}
