const express = require('express')
const route = express()
const userAmountController = require('../../controllers/clientControllers/userAmountController/userAmountController')

route.get('/userBalanceData_get', userAmountController.userBalanceData_get)
route.get('/userConvertBalance_get', userAmountController.userConvertBalance_get)

route.post('/userWithdrawal_record_post', userAmountController.userWithdrawal_record_post)

route.patch('/userBalanceConvertPatch', userAmountController.userBalanceConvertPatch)

module.exports = route