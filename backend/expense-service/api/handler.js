const Database = require('./../../common/database');
const ExpenseController = require('./expense.controller.js');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  Database.performDatabaseAction(ExpenseController.create.bind(ExpenseController, ...args));
};

module.exports.list = (...args) => {
  Database.performDatabaseAction(ExpenseController.list.bind(ExpenseController, ...args));
};

module.exports.delete = (...args) => {
  Database.performDatabaseAction(ExpenseController.delete.bind(ExpenseController, ...args));
};
