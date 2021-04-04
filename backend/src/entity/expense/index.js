const { Router } = require('express')
const Controller = require('./controller')
const router = new Router()

router.get('/', Controller.getAll)
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

module.exports = router
