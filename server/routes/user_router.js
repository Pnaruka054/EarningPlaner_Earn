const express = require('express')
const route = express()
const userController = require('../controllers/userController/userController')
const validator = require('../helper/validator')

route.get('/userDataGet', userController.userDataGet)
route.get('/userReferral_record_get', userController.userReferral_record_get)
route.get('/userProfileData_get', userController.userProfileData_get)
route.get('/userLoginCheckGet', userController.userLoginCheckGet)
route.get('/user_signUp_login_google', userController.user_signUp_login_google)
route.get('/verify_reset_token', userController.verify_reset_token)

route.post('/signUp', validator.signUpValidator, userController.userSignUp)
route.post('/login', userController.userLogin)
route.post('/userLoginforgot_password_send_mail', userController.userLoginforgot_password_send_mail)
route.post('/reset_password_form_post', validator.passwordValidator, userController.reset_password_form_post)
route.post('/logout', userController.userLogOut)

route.patch('/userProfileData_patch', userController.userProfileData_patch)

module.exports = route