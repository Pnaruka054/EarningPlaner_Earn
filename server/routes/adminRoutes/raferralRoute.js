const route = require('express')()
const referralController = require('../../controllers/adminControllers/referralController/referralController')

route.get("/adminReferralGet", referralController.adminReferralGet)

module.exports = route