const { Router } = require('express')
const Controller = require('./controller')
const router = new Router()
router.post('/', Controller.create)
router.put('/:id', Controller.update)
router.delete('/:id', Controller.delete)

router.post('/login', Controller.login)
router.post('/signup', Controller.signup)
router.get('/getSelf', Controller.getSelf)
router.get('/:id', Controller.getOne)
router.get('/', Controller.getAll)
module.exports = router
