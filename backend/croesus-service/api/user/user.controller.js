const bcrypt = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const jwtConfiguration = require('./../../../common/jwt-configuration.json');
const GroupController = require('./../group/group.controller');
const Controller = require('../../../common/controller');
const collections = require('../../../common/collections.json');

const model = require('./user.model');

function validateHeaderFormat(header) {
  return !!(
    header &&
    header.Authorization &&
    header.Authorization.length &&
    header.Authorization[0] &&
    header.Authorization[0].split
  );
}

function enrichBody(event, userFound) {
  const { body } = event;

  const method = event.httpMethod;

  if (method === 'POST') {
    body.createdBy = String(userFound._id);
  }

  if (method === 'DELETE') {
    body.deletedBy = String(userFound._id);
  }

  body.lastUpdatedBy = String(userFound._id);

  event.user = userFound.toObject();

  event.body = body;
}

/**
 * Removes duplicates in groups
 * and checks if all groups sent actually exist
 *
 * @param {*} event
 * @param {*} user
 * @param {*} callback
 */
async function checkGroupsValidity(event, user, callback) {
  if (event.body.groups) {
    const groupsIds = event.body.groups.map((g) => {
      if (typeof g === 'string') {
        return g;
      }
      return String(g._id);
    });
    event.body.groups = [...new Set(groupsIds)];
  }
  const userGroupsIds = user.groups.map((g) => g._id || g);
  const eventGroupsIds = event.body.groups.map((g) => g._id || g);

  const newGroupsIds = userGroupsIds.filter((id) => !eventGroupsIds.includes(id));
  if (newGroupsIds.length) {
    newGroupsIds.map((id) => {
      return GroupController.checkIfDocumentExistsInDb('_id', id, callback);
    });
    await Promise.all(newGroupsIds);
  }
}

class UserController extends Controller {
  constructor() {
    super(collections.USERS, model);
  }

  async checkForUniqueness(registeringUser, callback) {
    const user = await this.Model.findOne({ email: registeringUser.email.toLowerCase() });
    if (user) {
      return callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 409,
        body: JSON.stringify({
          message: `User already registered`,
        }),
      });
    }
    return true;
  }

  checkRequiredData(requestBody, callback) {
    if (!requestBody.email || !requestBody.password || !requestBody.name) {
      this.respond.with.error.common.invalidData(requestBody, callback);
    }
  }

  async create(event, context, callback) {
    const requestBody = event.body;

    this.checkRequiredData(requestBody, callback);
    await this.checkForUniqueness(requestBody, callback);
    const newUser = new this.Model(requestBody);
    try {
      await this.validate(newUser, callback);
      await newUser.save();
      return this.respond.with.success.creation(newUser, callback);
    } catch (err) {
      console.error(err);
      return this.respond.with.error.creation.db(newUser, callback);
    }
  }

  async update(event, context, callback) {
    const pathParameterId = String(event.pathParameters.id);
    const bodyId = String(event.body._id);
    const userId = String(event.user._id);
    if (pathParameterId !== bodyId || pathParameterId !== userId) {
      return this.respond.with.error.common.invalidData(event.body, callback);
    }
    delete event.body.password;
    await checkGroupsValidity(event, event.user, callback);
    console.log('event.body.groups :', event.body.groups);
    return super.update(event, context, callback);
  }

  async login(event, context, callback) {
    const requestBody = event.body;

    const { email, password } = requestBody;

    if (!email || !password) {
      return this.respond.with.error.common.invalidData(event.body, callback);
    }

    const userInCollection = await this.checkIfDocumentExistsInDb('email', email.toLowerCase(), callback);

    if (!bcrypt.compareSync(password, userInCollection.password)) {
      return this.respond.with.error.common.invalidData(event.body, callback);
    }

    const token = sign(
      {
        _id: userInCollection._id,
        email: userInCollection.email,
      },
      process.env.MONGODB_CONNECTION_STRING, // kind of stupid but hey, it works
      {
        expiresIn: jwtConfiguration.EXPIRES_IN,
        issuer: jwtConfiguration.ISSUER,
      }
    );
    return this.respond.with.success({ jwt: token, user: userInCollection }, callback);
  }

  getJWT(header, callback) {
    if (validateHeaderFormat(header)) {
      return header.Authorization[0].split(' ')[1];
    }
    this.respond.with.error.unauthorized(callback);
    throw new Error("Couldn't get jwt");
  }

  async authenticateJWT(event, context, callback) {
    try {
      const header = event.multiValueHeaders;
      const jwt = this.getJWT(header, callback);
      const verifiedToken = verify(jwt, process.env.MONGODB_CONNECTION_STRING, {
        expiresIn: jwtConfiguration.EXPIRES_IN,
        issuer: jwtConfiguration.ISSUER,
      });
      const userFound = await this.checkIfDocumentExistsInDb('_id', verifiedToken._id, callback);
      enrichBody(event, userFound);
    } catch (error) {
      console.error('Authenticate error :', error);
      this.respond.with.error.unauthorized(callback);
      throw new Error('Authentication failed');
    }
  }

  async getSelf(event, context, callback) {
    const { user } = event;
    const populatedUser = await this.Model.findById(user._id).populate('groups', { model: GroupController.Model });
    populatedUser.groups = populatedUser.groups.sort((a, b) => {
      return b.submittedAt - a.submittedAt;
    });
    this.respond.with.success({ document: populatedUser.toObject() }, callback);
  }

  async removeGroupFromUser(event, user, groupId) {
    const newUser = await this.Model.findByIdAndUpdate(
      user._id,
      {
        ...user,
        groups: user.groups.filter((g) => g && String(g._id) !== groupId),
      },
      { new: true }
    );
    event.user = newUser.toObject();
  }

  async updateFavoriteGroup(event) {
    event.user = await this.Model.findByIdAndUpdate(
      event.user._id,
      {
        ...event.user,
        favoriteGroup: event.user.groups[0],
      },
      { new: true }
    );
  }
}

module.exports = new UserController();
