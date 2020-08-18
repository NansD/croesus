const ExpenseController = require('./expense.controller.js');
const { applyMiddlewaresWithDatabase } = require('../../../common/applyMiddlewares');
const UserController = require('../user/user.controller');
const GroupController = require('./../group/group.controller');
const parseJson = require('./../../../common/parseJson');

const getGroup = (args) =>
  GroupController.enrichEventWithDocumentClosure('_id', args[0].pathParameters.groupId, 'group');

module.exports.submit = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args).bind(GroupController, ...args),
    ExpenseController.create.bind(ExpenseController, ...args)
  );
};

module.exports.update = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args).bind(GroupController, ...args),
    ExpenseController.update.bind(ExpenseController, ...args)
  );
};

module.exports.list = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args).bind(GroupController, ...args),
    ExpenseController.list.bind(ExpenseController, ...args)
  );
};

module.exports.delete = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args).bind(GroupController, ...args),
    ExpenseController.delete.bind(ExpenseController, ...args)
  );
};
