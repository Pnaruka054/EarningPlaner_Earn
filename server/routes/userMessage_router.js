const express = require('express')
const route = express()
const userMessageController = require('../controllers/userMessageController/userMessageController')

route.post('/userMessageSave_post', userMessageController.userMessageSave_post)

module.exports = route