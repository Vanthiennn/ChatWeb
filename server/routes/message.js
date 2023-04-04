const router = require("express").Router();
const messageControllers = require('../controllers/messageControllers')

router.post('/addmsg', messageControllers.addMessage)
router.post('/getmsg', messageControllers.getMessage)

module.exports = router