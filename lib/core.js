"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toString(v, attributes) {
  if (attributes) {
    var ks = Object.keys(attributes);
    if (ks.length > 0) {
      if (typeof v === 'string') {
        return v + JSON.stringify(attributes);
      }
      else {
        return JSON.stringify(v) + ' ' + JSON.stringify(attributes);
      }
    }
    else {
      return ts(v);
    }
  }
  else {
    return ts(v);
  }
}
exports.toString = toString;
function ts(v) {
  if (typeof v === 'string') {
    return v;
  }
  else {
    return JSON.stringify(v);
  }
}
exports.ts = ts;
