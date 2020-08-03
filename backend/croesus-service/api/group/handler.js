const Database = require('../../../common/database');
const GroupController = require('./group.controller.js');

// TODO I really need to find a more elegant way to handle that database connection !
module.exports.submit = (...args) => {
  Database.performDatabaseAction(GroupController.create.bind(GroupController, ...args));
};

module.exports.list = (...args) => {
  Database.performDatabaseAction(GroupController.list.bind(GroupController, ...args));
};

module.exports.delete = (...args) => {
  Database.performDatabaseAction(GroupController.delete.bind(GroupController, ...args));
};
