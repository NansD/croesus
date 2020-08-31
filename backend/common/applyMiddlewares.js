const Database = require('./database');
const parseJson = require('./middlewares/parseJson');
const setAWSContext = require('./middlewares/setAWSContext');
const headers = require('./headers.json');

module.exports.applyMiddlewares = async function applyMiddlewares(parameters, ...middlewares) {
  const callback = parameters[2];
  for (const m of middlewares) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await m(...parameters);
    } catch (error) {
      console.error(error);
      callback(null, {
        headers,
        statusCode: 500,
        body: JSON.stringify({
          message: `Error while applying middleware ${error}`,
        }),
      });
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
  const newMiddlewares = [parseJson(...parameters), setAWSContext(...parameters), ...middlewares];
  return Database.performDatabaseAction(applyMiddlewaresClosure(parameters, ...newMiddlewares));
};
