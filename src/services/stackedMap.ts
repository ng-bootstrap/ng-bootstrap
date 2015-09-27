export interface keyVal {
  key: Object;
  value: Object;
}

export class UibStackedMap {
  _stack: Array<keyVal>;

  constructor() {
    this._stack = [];
  }

  add(key, value) {
    this._stack.push({
      key: key,
      value: value
    });
  }

  get(key) {
    return this._stack.find(item => item.key === key);
  }

  keys() {
    return this._stack.map(item => item.key);
  }

  top() {
    return this._stack[this._stack.length - 1];
  }

  remove(key) {
    let idx = this._stack.findIndex(item => item.key === key);
    return this._stack.splice(idx, 1)[0];
  }

  removeTop() {
    return this._stack.splice(this._stack.length - 1, 1)[0];
  }

  length() {
    return this._stack.length;
  }
}
