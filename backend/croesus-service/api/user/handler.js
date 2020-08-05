const Database = require('../../../common/database');
const UserController = require('./user.controller.js');
const { applyMiddlewaresWithDatabase } = require('./../../../common/applyMiddlewares');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  Database.performDatabaseAction(UserController.create.bind(UserController, ...args));
};

module.exports.list = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    UserController.authenticateJWT.bind(UserController, ...args),
    UserController.list.bind(UserController, ...args)
  );
};

module.exports.delete = (...args) => {
  Database.performDatabaseAction(UserController.delete.bind(UserController, ...args));
};

module.exports.login = (...args) => {
  Database.performDatabaseAction(UserController.login.bind(UserController, ...args));
};
