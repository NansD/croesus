const Database = require('./database');

module.exports.applyMiddlewares = async function applyMiddlewares(parameters, ...middlewares) {
  const promises = middlewares.map((m) => {
    return m(...parameters);
  });
  return Promise.all(promises);
};

function applyMiddlewaresClosure(parameters, ...middlewares) {
  return function applyMiddlewares() {
    return exports.applyMiddlewares(parameters, ...middlewares);
  };
}

module.exports.applyMiddlewaresWithDatabase = function applyMiddlewaresWithDatabase(parameters, ...middlewares) {
  return Database.performDatabaseAction(applyMiddlewaresClosure(parameters, ...middlewares));
};
