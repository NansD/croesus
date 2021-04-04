const express = require('express')
const isAuthenticated = require('../middleware/isAuthenticated')
const router = express.Router()
const GroupController = require('../entity/group/controller')
const getGroup = (req, res, next) =>
  GroupController.enrichEventWithDocumentClosure('_id', req.params.groupId, 'group')(req, res, next)

router.use('/users', require('../entity/user'))
router.use('/groups', isAuthenticated, require('../entity/group'))
router.use('/groups/:groupId/expenses', isAuthenticated, getGroup, require('../entity/expense'))

module.exports = router
