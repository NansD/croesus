const Controller = require('../../../common/controller');
const collections = require('../../../common/collections.json');

const model = require('./group.model');
const UserController = require('../user/user.controller');

class GroupController extends Controller {
  constructor() {
    super(collections.GROUPS, model);
  }

  async createGroup(event, context, callback) {
    const requestBody = event.body;
    const instance = new this.Model(requestBody);

    await this.validate(instance, callback);

    let group;
    try {
      group = await instance.save();
    } catch (error) {
      console.error(error);
      return this.respond.with.error.creation.db(group, callback);
    }
    return group;
  }

  async create(event, context, callback) {
    const group = await this.createGroup(event, context, callback);
    try {
      await UserController.Model.findByIdAndUpdate(event.user._id, {
        ...event.user,
        groups: [...event.user.groups, group._id],
      });
      this.respond.with.success.creation(group, callback);
    } catch (error) {
      console.error('error :', error);
      this.respond.with.error.update.db(event.user, callback);
    }
  }
}

module.exports = new GroupController();
