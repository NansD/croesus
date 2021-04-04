const { Controller } = require('../abstract-entity/controller')
const GroupController = require('../group/controller')
const collections = require('../collections.json')
const model = require('./user.model')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')
const { sign } = require('jsonwebtoken')
class UserController extends Controller {
  constructor() {
    super(collections.USERS, model)
  }

  async login(req, res) {
    console.debug('login')
    const requestBody = req.body

    const { email, password } = requestBody

    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ requestBody })
    }
    const [error, userInCollection] = await this.checkIfDocumentExistsInDb(
      'email',
      email.toLowerCase()
    )
    if (error) {
      return res.status(StatusCodes.NOT_FOUND).json({ requestBody, error })
    }
    const user = await this.Model.findById(userInCollection._id).populate('groups', {
      model: GroupController.Model
    })

    if (!bcrypt.compareSync(password, userInCollection.password)) {
      return res.status(StatusCodes.UNAUTHORIZED)
    }

    const token = sign(
      {
        _id: userInCollection._id,
        email: userInCollection.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION,
        issuer: 'Croesus'
      }
    )
    return res.status(StatusCodes.OK).json({ jwt: token, user })
  }

  async signup(req, res) {
    return await super.create(req, res)
  }

  async getSelf(req, res) {
    const self = await this.Model.findById(req.context.user._id).populate('groups')
    self.groups.sort((a, b) => {
      return b.submittedAt - a.submittedAt
    })
    return res.status(StatusCodes.OK).json({ document: self })
  }
}

module.exports = new UserController()
