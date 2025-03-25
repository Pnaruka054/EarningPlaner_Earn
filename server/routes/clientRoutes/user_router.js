const express = require('express')
const route = express()
const userController = require('../../controllers/clientControllers/userController/userController')
const validator = require('../../helper/validator');
const { decryptData } = require('../../helper/encrypt_decrypt_data');
const decryptMiddleware = async (req, res, next) => {
    try {
        req.body = await decryptData(req.body.obj);
        next();
    } catch (err) {
        return res.status(400).json({ error: "Decryption failed" });
    }
};

route.get('/userDataGet_dashboard', userController.userDataGet_dashboard)
route.get('/userReferral_record_get', userController.userReferral_record_get)
route.get('/userProfileData_get', userController.userProfileData_get)
route.get('/user_signUp_login_google', userController.user_signUp_login_google)
route.get('/verify_reset_token', userController.verify_reset_token)
route.get('/verify_reset_email_token', userController.verify_reset_email_token)
route.get('/userWebstatisticsGet', userController.userWebstatisticsGet)
route.get('/userpassword_and_email_get', userController.userpassword_and_email_get)

route.post('/signUp', decryptMiddleware, validator.signUpValidator, userController.userSignUp)
route.post('/login', userController.userLogin)
route.post('/userLoginforgot_password_send_mail', userController.userLoginforgot_password_send_mail)
route.post('/reset_password_form_post', userController.reset_password_form_post)
route.post('/logout', userController.userLogOut)

route.patch('/userProfileData_patch', userController.userProfileData_patch)
route.patch('/userpassword_and_email_patch', userController.userpassword_and_email_patch)

module.exports = route