const { StatusCodes } = require('http-status-codes')
module.exports = function isAuthenticated(req, res, next) {
  if (!req.context.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json('You are unauthenticated. Please log in.')
  }
  next()
}
