const { check } = require("express-validator");

const signUpValidator = [
    check('mobile_number', 'Mobile number must be 10 digits').isLength({
        max: 10,
        min: 10
    }),
    check('email_address', 'Please enter valid gmail address').isEmail().normalizeEmail({
        gmail_lowercase: true,
        gmail_remove_dots: true,
    }),
    check('password', 'Password must contain min 8 characters').isLength({ min: 8 })
]

const passwordValidator = [
    check('password', 'Password must contain min 8 characters').isLength({ min: 8 })
]

const otpValidator = [
    check('otp', 'OTP is only 4 digits').isLength({
        max: 4,
        min: 4
    })
]

module.exports = {
    signUpValidator,
    passwordValidator,
    otpValidator,
}