const Controller = require('../../../common/controller');
const collections = require('../../../common/collections.json');

const model = require('./user.model');

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

  async create(event, context, callback) {
    const requestBody = JSON.parse(event.body);
    if (requestBody.email && requestBody.password && requestBody.name) {
      await this.checkForUniqueness(requestBody, callback);
      const newUser = new this.Model(requestBody);
      try {
        await newUser.save();
        await this.validate(newUser, callback);
        return this.respondWithCreationSuccess(newUser, callback);
      } catch (err) {
        console.error(err);
        // return res.status(500).json({ error: err });
      }
    }
    return callback(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      statusCode: 400,
      body: JSON.stringify({
        message: `Missing information`,
      }),
    });
  }
}

module.exports = new UserController();
