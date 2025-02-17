const jwt = require('jsonwebtoken');
const userSignUp_module = require('../model/userSignUp/userSignUp_module')

const middleware_userLogin_check = async (req, res, next) => {
    try {
        if (
            req.originalUrl === '/userRoute/login'
            || req.originalUrl === '/userRoute/signUp'
            || req.originalUrl.includes('/userRoute/user_signUp_login_google')
            || req.originalUrl.includes('/userRoute/userLoginforgot_password_send_mail')
            || req.originalUrl.includes('/userRoute/reset_password_form_post')
            || req.originalUrl.includes('/userRoute/verify_reset_token')
        ) {
            return next(); // Skip middleware for this route
        }

        // Retrieve the token from cookies (assuming it's named 'jwtToken')
        const token = req.cookies.jwtToken; // 'jwtToken' is the cookie name you set in the login route
        if (!token) {
            return res.status(401).json({
                success: false,
                jwtMiddleware_token_not_found_error: 'Authorization token missing or invalid'
            });
        }

        // Verify the token using your JWT secret key
        const decoded = await jwt.verify(token, process.env.JWT_ACCESS_KEY);
        let decodedData_fromDB = await userSignUp_module.findById(decoded.jwtUser._id)
        if (!decodedData_fromDB) {
            return res.status(404).json({
                success: false,
                jwtMiddleware_user_not_found_error: 'Authorization token invalid or user not found'
            });
        }

        if (decoded.jwtUser.password !== decodedData_fromDB.password) {
            return res.status(404).json({
                success: false,
                jwtMiddleware_user_not_found_error: 'password mismatch please login again'
            });
        }

        // Attach the decoded user info to the request object
        req.user = decodedData_fromDB;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            jwtMiddleware_error: 'Invalid or expired token',
            error: error.message
        });
    }
};

module.exports = {
    middleware_userLogin_check
};
