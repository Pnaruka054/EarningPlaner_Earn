const express = require('express')
const route = express()
const advertiserController = require('../../controllers/advertiserController/advertiserController')

route.get('/advertiserDataGet', advertiserController.advertiserDataGet)
route.get('/advertiserCreateDataGet', advertiserController.advertiserCreateDataGet)

route.post('/advertiserDataPost', advertiserController.advertiserDataPost)

route.patch('/advertiserCampaign_paused_active_patch', advertiserController.advertiserCampaign_paused_active_patch)

module.exports = route