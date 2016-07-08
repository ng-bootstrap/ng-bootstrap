export function toBoolean(value: any): boolean {
  return value === '' ? true : !!value;
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}
