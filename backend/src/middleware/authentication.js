const jwt = require('jsonwebtoken')

const { Model: UserModel } = require('../entity/user/controller')

const authentication = async (req, res, next) => {
  try {
    Object.assign(req, { context: {} })

    const {
      headers: { authorization }
    } = req
    if (!authorization) {
      return next()
    }

    const accessToken = authorization.split(' ')[1]

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
    if (!decoded) {
      return next()
    }

    const user = await UserModel.findById(decoded._id)
    if (!user) {
      return next()
    }

    Object.assign(req, {
      context: {
        user: user.toJSON(),
        accessToken
      }
    })

    return next()
  } catch (error) {
    return next()
  }
}

module.exports = authentication
