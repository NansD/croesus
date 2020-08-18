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
      await UserController.Model.findByIdAndUpdate(
        event.user._id,
        {
          ...event.user,
          groups: [...event.user.groups, group._id],
        },
        { new: true }
      );
      this.respond.with.success.creation(group, callback);
    } catch (error) {
      console.error('error :', error);
      this.respond.with.error.update.db(event.user, callback);
    }
  }

  async getOne(event, context, callback) {
    let document;
    try {
      document = await this.checkIfDocumentExistsInDb('_id', event.pathParameters.id, callback);
      document.expenses = document.expenses.sort((a, b) => {
        return b.submittedAt - a.submittedAt;
      });
      return this.respond.with.success.getOne(document, callback);
    } catch (error) {
      console.error('Error while getting document', JSON.stringify(error));
      return this.respond.with.error.common.db(callback);
    }
  }

  async delete(event, context, callback) {
    const { user } = event;
    const userGroups = event.user.groups.map((g) => String(g));
    const favoriteGroup = String(user.favoriteGroup);
    try {
      if (userGroups.includes(event.pathParameters.id)) {
        UserController.removeGroupFromUser(event, user, event.pathParameters.id);
      }
      if (favoriteGroup === event.pathParameters.id) {
        UserController.updateFavoriteGroup(event);
      }
      await super.delete(event, context, callback);
    } catch (error) {
      this.respond.with.error.common.db(callback);
    }
  }
}

module.exports = new GroupController();
