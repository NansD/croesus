const Database = require('./database');
const parseJson = require('./parseJson');

async function applyMiddlewares(parameters, ...middlewares) {
  for (const m of middlewares) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await m(...parameters);
    } catch (error) {
      console.error(error);
      break;
    }
  }
}

/**
 * Connect to the database, then apply functions middlewares sequentially
 * @param {Array} parameters
 * @param {Function} middlewares
 */
module.exports.applyMiddlewaresWithDatabase = function applyMiddlewaresWithDatabase(parameters, ...middlewares) {
  // eslint-disable-next-line no-unused-vars
  const db = Database.connectToDatabase();
  const newMiddlewares = [parseJson(...parameters), ...middlewares];
  return applyMiddlewares(parameters, ...newMiddlewares);
};
