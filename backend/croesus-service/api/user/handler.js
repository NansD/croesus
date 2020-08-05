const UserController = require('./user.controller.js');
const { applyMiddlewaresWithDatabase } = require('./../../../common/applyMiddlewares');
const parseJson = require('./../../../common/parseJson');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  applyMiddlewaresWithDatabase([...args], parseJson(...args), UserController.create.bind(UserController, ...args));
};

module.exports.list = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    UserController.list.bind(UserController, ...args)
  );
};

module.exports.delete = (...args) => {
  applyMiddlewaresWithDatabase(
    [...args],
    parseJson(...args),
    UserController.authenticateJWT.bind(UserController, ...args),
    UserController.delete.bind(UserController, ...args)
  );
};

module.exports.login = (...args) => {
  applyMiddlewaresWithDatabase([...args], parseJson(...args), UserController.login.bind(UserController, ...args));
};
