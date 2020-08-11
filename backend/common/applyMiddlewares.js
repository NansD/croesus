const Database = require('./database');

module.exports.applyMiddlewares = async function applyMiddlewares(parameters, ...middlewares) {
  for (const m of middlewares) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await m(...parameters);
    } catch (error) {
      console.error(error);
      break;
    }
  }
};

function applyMiddlewaresClosure(parameters, ...middlewares) {
  return function applyMiddlewares() {
    return exports.applyMiddlewares(parameters, ...middlewares);
  };
}

module.exports.applyMiddlewaresWithDatabase = function applyMiddlewaresWithDatabase(parameters, ...middlewares) {
  return Database.performDatabaseAction(applyMiddlewaresClosure(parameters, ...middlewares));
};
