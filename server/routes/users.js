const router = require("express").Router();
const userControllers = require('../controllers/userControllers')

// Get all user
router.get('/all/:id',  userControllers.getAllUser)
router.post('/setavatar/:id', userControllers.setAvatar)
module.exports = router

