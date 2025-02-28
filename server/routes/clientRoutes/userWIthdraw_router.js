const express = require('express')
const route = express()
const userWithdrawController = require('../../controllers/clientControllers/userWithdrawController/userWithdrawController')

route.get('/userBalanceData_get', userWithdrawController.userBalanceData_get)

route.post('/userWithdrawal_record_post', userWithdrawController.userWithdrawal_record_post)

route.patch('/userBalanceConvertPatch', userWithdrawController.userBalanceConvertPatch)

module.exports = route