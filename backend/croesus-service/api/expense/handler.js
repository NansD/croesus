const Database = require('../../../common/database');
const ExpenseController = require('./expense.controller.js');
const { applyMiddlewaresWithDatabase } = require('../../../common/applyMiddlewares');
const UserController = require('../user/user.controller');
const parseJson = require('./../../../common/parseJson');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    ExpenseController.create.bind(ExpenseController, ...args)
  );
};

module.exports.list = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    ExpenseController.list.bind(ExpenseController, ...args)
  );
};

module.exports.delete = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    ExpenseController.delete.bind(ExpenseController, ...args)
  );
};

module.exports.computeDebts = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    ExpenseController.computeDebts.bind(ExpenseController, ...args)
  );
};
