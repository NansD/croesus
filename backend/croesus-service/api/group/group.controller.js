const Controller = require('../../../common/controller');
const collections = require('../../../common/collections.json');

const model = require('./group.model');

class GroupController extends Controller {
  constructor() {
    super(collections.GROUPS, model);
  }
}

module.exports = new GroupController();
