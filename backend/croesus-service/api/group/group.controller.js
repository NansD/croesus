const Controller = require('../../../common/controller');
const collections = require('../../../common/collections.json');

const model = require('./group.model');
const UserController = require('../user/user.controller');

class GroupController extends Controller {
  constructor() {
    super(collections.GROUPS, model);
  }

  create(event, context, callback) {
    console.log(' :');
    UserController.Model.findByIdAndUpdate();
  }
}

module.exports = new GroupController();
