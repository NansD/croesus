const bcrypt = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const jwtConfiguration = require('./../../../common/jwt-configuration.json');

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

  // eslint-disable-next-line no-param-reassign
  event.user = userFound.toObject();

  // eslint-disable-next-line no-param-reassign
  event.body = body;
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

  async login(event, context, callback) {
    const requestBody = event.body;

    const { email, password } = requestBody;

    if (!email || !password) {
      return this.respond.with.error.common.invalidData(callback);
    }

    const userInCollection = await this.checkIfDocumentExistsInDb('email', email.toLowerCase(), callback);

    if (!bcrypt.compareSync(password, userInCollection.password)) {
      return this.respond.with.error.common.invalidData(callback);
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
    return this.respond.with.success({ jwt: token }, callback);
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
}

module.exports = new UserController();
