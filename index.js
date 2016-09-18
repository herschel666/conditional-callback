
const keys = require('ramda/src/keys');
const isNil = require('ramda/src/isNil');
const merge = require('ramda/src/merge');
const equals = require('ramda/src/equals');
const reduce = require('ramda/src/reduce');
const allPass = require('ramda/src/allPass');

const applySelector = (selector, fn, state) => {
  const selectorKeys = keys(selector);
  const matches = reduce((valid, key) => {
    const conditions = Array.isArray(selector[key]) ? selector[key] : [selector[key]];
    return valid && allPass(conditions)(state[key]);
  }, true, selectorKeys);
  if (matches) {
    fn(reduce((obj, key) => merge(obj, {
      [key]: state[key]
    }), {}, selectorKeys));
  }
  return state;
};

const createConditionalCallback = (selector, fn, needsChange) => {
  const _needsChange = isNil(needsChange) || Boolean(needsChange);
  var prevState = {};
  return (state) => {
    if (_needsChange && equals(prevState, state)) {
      return state;
    }
    prevState = state;
    return applySelector(selector, fn, state);
  };
};

module.exports = exports.default = createConditionalCallback;
