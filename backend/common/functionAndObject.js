/* eslint-disable no-param-reassign */
const cloneInObject = (action, object) => {
  const keys = Object.keys(object);
  keys.forEach((k) => {
    if (typeof object[k] !== 'object') {
      action[k] = object[k];
    } else {
      action[k] = cloneInObject(action, object(k));
    }
  });
  return action;
};
module.exports = function functionAndObject(fn, object) {
  const action = fn;
  return cloneInObject(action, object);
};
