const Database = require('./../database');

module.exports = function useDatabase(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = (...args) => {
      Database.performDatabaseAction(original.apply(this, args));
    };
  }
  return descriptor;
};
