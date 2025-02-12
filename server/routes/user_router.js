const express = require('express')
const route = express()
const userController = require('../controllers/userController/userController')
const validator = require('../helper/validator')

route.get('/userDataGet', userController.userDataGet)
route.get('/userReferral_record_get', userController.userReferral_record_get)
route.get('/userProfileData_get', userController.userProfileData_get)

route.post('/signUp', validator.signUpValidator, userController.userSignUp)
route.post('/login', userController.userLogin)
route.post('/logout', userController.userLogOut)

route.patch('/userProfileData_patch', userController.userProfileData_patch)

module.exports = route