const GroupController = require('./group.controller.js');
const { applyMiddlewaresWithDatabase } = require('./../../../common/applyMiddlewares');
const UserController = require('../user/user.controller');
const ExpenseController = require('./../expense/expense.controller');
const parseJson = require('./../../../common/parseJson');

const getGroup = (args, key) =>
  GroupController.enrichEventWithDocumentClosure('_id', args[0].pathParameters[key], 'group').bind(
    GroupController,
    ...args
  );

module.exports.submit = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.create.bind(GroupController, ...args)
  );
};

module.exports.update = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args, 'id'),
    GroupController.update.bind(GroupController, ...args)
  );
};

module.exports.list = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.list.bind(GroupController, ...args)
  );
};

module.exports.getOne = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.getOne.bind(GroupController, ...args)
  );
};

module.exports.delete = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.delete.bind(GroupController, ...args)
  );
};

module.exports.computeDebts = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    getGroup(args, 'groupId').bind(GroupController, ...args),
    ExpenseController.computeDebts.bind(ExpenseController, ...args)
  );
};
