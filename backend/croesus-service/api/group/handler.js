const GroupController = require('./group.controller.js');
const { applyMiddlewaresWithDatabase } = require('./../../../common/applyMiddlewares');
const UserController = require('../user/user.controller');
const parseJson = require('./../../../common/parseJson');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.create.bind(GroupController, ...args)
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

module.exports.delete = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    GroupController.delete.bind(GroupController, ...args)
  );
};
