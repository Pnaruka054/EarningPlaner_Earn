const jwt = require('jsonwebtoken');

const middleware_userLogin_check = async (req, res, next) => {
    try {
        if (req.originalUrl === '/userRoute/login' || req.originalUrl === '/userRoute/signUp') {
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
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        // Attach the decoded user info to the request object
        req.user = decoded.jwtUser;

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
