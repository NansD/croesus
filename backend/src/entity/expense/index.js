const { Router } = require('express')
const Controller = require('./controller')
const GroupController = require('../group/controller')
const router = new Router()
const getGroup = (req, res, next) =>
  GroupController.enrichEventWithDocumentClosure('_id', req.params.groupId, 'group')(req, res, next)

router.get('/', Controller.getAll)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

module.exports = router
