require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const server = http.createServer(app);
const cookieParser = require('cookie-parser');
const middleware = require('./middlewares/jwt_to_userData_middleware')
const userRouter = require('./routes/clientRoutes/user_router');
const userWithdraw = require('./routes/clientRoutes/userWIthdraw_router');
const userIncomeRoute = require('./routes/clientRoutes/userIncome_router');
const userMessageRoute = require('./routes/clientRoutes/userMessage_router');
const postBack = require('./routes/postBack')
const checkLogin_for_navBar = require('./routes/checkLogin_for_navBar')
const { cronForDaily_midNight_update } = require('./helper/cronJobs')
const adminRoutes = require('./routes/adminRoutes/adminRoutes')
const bodyParser = require('body-parser');
const { userDateIncome } = require('./helper/socketIo_realTime_db_monitor');

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://earningplaner-earn.onrender.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Regular expression jo "earnwiz.in" aur uske subdomains ko match karega.
        const earnwizRegex = /^https?:\/\/([a-z0-9-]+\.)*earnwiz\.in$/i;

        if (allowedOrigins.includes(origin) || earnwizRegex.test(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};

app.set('trust proxy', true);

// middlewares
app.use((req, res, next) => {
    if (req.path.startsWith('/postBack')) {
        next(); // Bypass CORS middleware
    } else {
        cors(corsOptions)(req, res, next); // Apply CORS middleware
    }
});
const io = socketIo(server, {
    cors: corsOptions
});
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
async function Database_connection() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}
Database_connection();


// Global Middleware Setup
app.use(middleware.middleware_userLogin_check); // Global login check middleware

// Routes
app.use('/userRoute', userRouter);
app.use('/userWithdraw', userWithdraw);
app.use('/userIncomeRoute', userIncomeRoute);
app.use('/userMessageRoute', userMessageRoute);
app.use('/postBack', postBack);
app.use('/checkLogin_for_navBar', checkLogin_for_navBar);
app.use('/admin', middleware.adminCheck_middleware, adminRoutes);

// cron jobs
cronForDaily_midNight_update()

// handle socket io
io.use(middleware.socketAuthMiddleware)
userDateIncome(io)

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
