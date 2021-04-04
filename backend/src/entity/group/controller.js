const { StatusCodes } = require('http-status-codes')
const { Controller } = require('../abstract-entity/controller')
const UserModel = require('./../user/model')
const collections = require('../collections.json')
const model = require('./group.model')

class GroupController extends Controller {
  constructor() {
    super(collections.GROUPS, model)
  }

  async getOne(req, res) {
    const { id } = req.params

    const [error, document] = await this.checkIfDocumentExistsInDb('_id', id)

    if (!document && !error) {
      return res.status(StatusCodes.NOT_FOUND).json({ error, document })
    }
    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, document })
    }
    document.expenses.sort((a, b) => {
      return b.submittedAt - a.submittedAt
    })

    return res.status(StatusCodes.OK).json({ document })
  }

  async createGroup(requestBody) {
    const instance = new this.Model(requestBody)
    let group, error
    try {
      group = await instance.save()
    } catch (errorThrown) {
      console.error(errorThrown)
      error = errorThrown
    }
    return [error, group]
  }

  async create(req, res) {
    const [error, group] = await this.createGroup(req.body)
    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
    }
    try {
      const userDocument = await UserModel.findByIdAndUpdate(
        req.context.user._id,
        {
          ...req.context.user,
          groups: [...req.context.user.groups, group._id]
        },
        { new: true }
      )
      const user = userDocument.toObject()
      if (!user.favoriteGroup) {
        user.favoriteGroup = group._id
        await UserModel.findByIdAndUpdate(user._id, user)
      }
      return res.status(StatusCodes.OK).json({ document: group })
    } catch (error) {
      console.error('error :', error)
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
    }
  }
  async delete(req, res) {
    const { user } = req.context
    const userGroups = user.groups.map(g => String(g))
    const favoriteGroup = String(user.favoriteGroup)
    try {
      if (userGroups.includes(req.params.id)) {
        const newUser = await UserModel.findByIdAndUpdate(
          user._id,
          {
            ...user,
            groups: user.groups.filter(g => g && String(g._id) !== req.params.id)
          },
          { new: true }
        )
        req.context.user = newUser.toJSON()
      }
      if (favoriteGroup === req.params.id) {
        UserModel.findByIdAndUpdate(
          user._id,
          {
            ...user,
            favoriteGroup: user.groups[0]
          },
          { new: true }
        )
      }
      return await super.delete(req, res)
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error })
    }
  }
}

module.exports = new GroupController()
