const { check } = require("express-validator");

const signUpValidator = [
    check('mobile_number', 'Mobile number must be 10 digits')
        .isLength({ min: 10, max: 10 })
        .isNumeric().withMessage("Mobile number must be numeric"),
    
    check('email_address', 'Please enter valid Email address')
        .isEmail()
        .normalizeEmail({ gmail_lowercase: true, gmail_remove_dots: true }),
    
    check('password', 'Password must contain at least 8 characters')
        .isLength({ min: 8 })
];

module.exports = {
    signUpValidator
}