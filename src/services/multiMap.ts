export class UibMultiMap {
  _map: Object;

  constructor() { this._map = {}; }

  entries() { return Object.keys(this._map).map(key => {return {key: key, value: this._map[key]}}); }

  get(key) { return this._map[key]; }

  hasKey(key) { return !!this._map[key]; }

  keys() { return Object.keys(this._map); }

  put(key, value) {
    if (!this._map[key]) {
      this._map[key] = [];
    }

    this._map[key].push(value);
  }

  remove(key, value) {
    var values = this._map[key];

    if (!values) {
      return;
    }

    var idx = values.findIndex(val => Object.is(val, value));

    if (idx !== -1) {
      values.splice(idx, 1);
    }

    if (!values.length) {
      delete this._map[key];
    }
  }
}
