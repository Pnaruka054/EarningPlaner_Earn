const jwt = require('jsonwebtoken');
const userSignUp_module = require('../model/userSignUp/userSignUp_module')
const admin_module = require('../model/admin/admin_module')

const middleware_userLogin_check = async (req, res, next) => {
    try {
        if (
            req.originalUrl === '/userRoute/login'
            || req.originalUrl === '/userRoute/signUp'
            || req.originalUrl === '/userMessageRoute/userMessageSave_post'
            || req.originalUrl === '/userRoute/userWebstatisticsGet'
            || req.originalUrl.includes('/checkLogin_for_navBar')
            || req.originalUrl.includes('/userRoute/user_signUp_login_google')
            || req.originalUrl.includes('/userRoute/userLoginforgot_password_send_mail')
            || req.originalUrl.includes('/userRoute/reset_password_form_post')
            || req.originalUrl.includes('/userRoute/verify_reset_token')
            || req.originalUrl.includes('/userRoute/verify_reset_email_token')
            || req.originalUrl.includes('/postBack/postBackCPX')
            || req.originalUrl.includes('/admin')
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
            res.clearCookie('jwtToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(404).json({
                success: false,
                jwtMiddleware_user_not_found_error: 'Authorization token invalid or user not found'
            });
        }

        if (decoded.jwtUser.password !== decodedData_fromDB.password) {
            res.clearCookie('jwtToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(404).json({
                success: false,
                jwtMiddleware_user_not_found_error: 'password mismatch please login again'
            });
        }

        if (decoded.jwtUser.email_address !== decodedData_fromDB.email_address) {
            res.clearCookie('jwtToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(404).json({
                success: false,
                jwtMiddleware_user_not_found_error: 'email updated please login again'
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

const adminCheck_middleware = async (req, res, next) => {
    try {
        // Exclude login route from middleware check
        if (req.originalUrl.includes('/admin/adminLogin')) {
            return next();
        }

        // Get token from cookies
        const token = req.cookies.admin_jwt_token;
        if (!token) {
            return res.status(401).json({
                success: false,
                adminJWT_error_msg: 'Authorization token missing'
            });
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        } catch (err) {
            res.clearCookie('admin_jwt_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(403).json({
                success: false,
                adminJWT_error_msg: 'Invalid or expired token. Please log in again.'
            });
        }

        // Fetch admin data from DB
        const admin = await admin_module.findById(decoded.jwtUser._id);
        if (!admin) {
            res.clearCookie('admin_jwt_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(404).json({
                success: false,
                adminJWT_error_msg: 'User not found. Please log in again.'
            });
        }

        // Ensure password has not changed after token issuance
        if (decoded.jwtUser.adminPassword !== admin.adminPassword) {
            res.clearCookie('admin_jwt_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(403).json({
                success: false,
                adminJWT_error_msg: 'Password changed. Please log in again.'
            });
        }

        // Ensure username has not changed
        if (decoded.jwtUser.adminUserName !== admin.adminUserName) {
            res.clearCookie('admin_jwt_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.status(403).json({
                success: false,
                adminJWT_error_msg: 'Username updated. Please log in again.'
            });
        }

        // Attach admin data to the request object
        req.adminData = admin;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Middleware Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

module.exports = {
    middleware_userLogin_check,
    adminCheck_middleware
};
