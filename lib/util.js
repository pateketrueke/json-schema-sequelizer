'use strict';

const METHODS = ['hasOne', 'hasMany', 'belongsTo', 'belongsToMany'];
const PROPERTIES = ['sourceKey', 'targetKey', 'foreignKey', 'otherKey', 'constraints', 'scope', 'through', 'as'];

function id(ref) {
  return ref.match(/\/?([^/#]+)#?$/)[1];
}

/* eslint-disable no-use-before-define */
function clone(arr) {
  const out = [];

  arr.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      out[index] = Array.isArray(item) ? clone(item) : merge({}, item);
    } else {
      out[index] = item;
    }
  });

  return out;
}

function merge(a, b) {
  Object.keys(b).forEach(key => {
    if (typeof b[key] !== 'object' || b[key] === null) {
      a[key] = b[key];
    } else if (Array.isArray(b[key])) {
      a[key] = (a[key] || []).concat(clone(b[key]));
    } else if (typeof a[key] !== 'object' || a[key] === null || Array.isArray(a[key])) {
      a[key] = merge({}, b[key]);
    } else {
      a[key] = merge(a[key], b[key]);
    }
  });

  return a;
}

function getRefs(schema) {
  const _params = {};

  let _method;
  let _obj;

  for (let i = 0, c = METHODS.length; i < c; i += 1) {
    if (schema[METHODS[i]]) {
      _method = METHODS[i];
      _obj = schema[METHODS[i]];
      break;
    }
  }

  if (typeof _obj === 'object') {
    PROPERTIES.forEach(prop => {
      if (_obj[prop]) {
        _params[prop] = _obj[prop];
      }
    });
  }

  return {
    target: id(schema.$ref),
    method: _method,
    params: _params,
  };
}

module.exports = {
  id,
  merge,
  getRefs,
};