const { Router } = require('express')
const Controller = require('./controller')
const ExpenseController = require('./../expense/controller')
const router = new Router()
const getGroup = (req, res, next) =>
  Controller.enrichEventWithDocumentClosure('_id', req.params.id, 'group')(req, res, next)
router.get('/', Controller.getAll)
router.get('/:id', Controller.getOne)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)
router.get('/:id/computeDebts', getGroup, ExpenseController.computeDebts)
module.exports = router
