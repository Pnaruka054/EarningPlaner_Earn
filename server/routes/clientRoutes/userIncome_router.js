const express = require('express')
const route = express()
const userIncomeController = require('../../controllers/clientControllers/userIncomeController/userIncomeController')

route.get('/user_PTCAds_home_get', userIncomeController.user_PTCAds_home_get)
route.get('/user_shortlink_data_get', userIncomeController.user_shortlink_data_get)
route.get('/user_offerWall_get', userIncomeController.user_offerWall_get)
route.get('/user_giftCode_get', userIncomeController.user_giftCode_get)

route.patch('/user_PTCAds_income_patch', userIncomeController.user_PTCAds_income_patch)
route.patch('/user_shortlink_firstPage_data_patch', userIncomeController.user_shortlink_firstPage_data_patch)
route.patch('/user_shortlink_lastPage_data_patch', userIncomeController.user_shortlink_lastPage_data_patch)
route.patch('/user_giftCode_verify_and_patch', userIncomeController.user_giftCode_verify_and_patch)

module.exports = route