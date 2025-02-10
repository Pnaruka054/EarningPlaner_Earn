const express = require('express')
const route = express()
const userIncomeController = require('../controllers/userIncomeController/userIncomeController')

route.get('/user_adsView_home_get', userIncomeController.user_adsView_home_get)
route.patch('/user_adsView_income_patch', userIncomeController.user_adsView_income_patch)

module.exports = route