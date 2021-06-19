const { Controller } = require('../abstract-entity/controller')
const GroupController = require('../group/controller')
const collections = require('../collections.json')
const model = require('./user.model')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')
const { sign } = require('jsonwebtoken')

/**
 * Removes duplicates in groups
 * and checks if all groups sent actually exist
 *
 * @param {*} body
 * @param {*} user
 */
async function checkGroupsValidity(body, user) {
  if (body.groups) {
    const groupsIds = body.groups.map(g => {
      if (typeof g === 'string') {
        return g
      }
      return String(g._id)
    })
    body.groups = [...new Set(groupsIds)]
  }
  const userGroupsIds = user.groups.map(g => g._id || g)
  const eventGroupsIds = body.groups.map(g => g._id || g)
  const newGroupsIds = userGroupsIds.filter(id => !eventGroupsIds.includes(id))
  if (newGroupsIds.length) {
    newGroupsIds.map(id => {
      return GroupController.checkIfDocumentExistsInDb('_id', id)
    })
    await Promise.all(newGroupsIds)
  }
}
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
        // this thing is annoying
        // expiresIn: process.env.JWT_EXPIRATION,
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

  async update(req, res) {
    console.log('req.body :', req.body)
    const self = await this.Model.findById(req.context.user._id).populate('groups')
    await checkGroupsValidity(req.body, self)
    await super.update(req, res)
  }
}

module.exports = new UserController()
