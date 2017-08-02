export function toInteger(value) {
    return parseInt("" + value, 10);
}
export function toString(value) {
    return (value !== undefined && value !== null) ? "" + value : '';
}
export function getValueInRange(value, max, min) {
    if (min === void 0) { min = 0; }
    return Math.max(Math.min(value, max), min);
}
export function isString(value) {
    return typeof value === 'string';
}
export function isNumber(value) {
    return !isNaN(toInteger(value));
}
export function isDefined(value) {
    return value !== undefined && value !== null;
}
export function padNumber(value) {
    if (isNumber(value)) {
        return ("0" + value).slice(-2);
    }
    else {
        return '';
    }
}
export function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
//# sourceMappingURL=util.js.map