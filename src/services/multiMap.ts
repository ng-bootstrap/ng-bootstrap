export class UIBMultiMap {
  _map: Object;

  constructor() {
    this._map = {};
  }

  entries() {
    return Object.keys(map).map(key => { key: key, value: map[key] });
  }

  get(key) {
    return map[key];
  }

  hasKey(key) {
    return !!map[key];
  }

  keys() {
    return Object.keys(map);
  }

  put(key, value) {
    if (!map[key]) {
      map[key] = [];
    }

    map[key].push(value);
  }

  remove(key, value) {
    var values = map[key];

    if (!values) {
      return;
    }

    var idx = values.findIndex(val => Object.is(val, value));

    if (idx !== -1) {
      values.splice(idx, 1);
    }

    if (!values.length) {
      delete map[key];
    }
  }
}
