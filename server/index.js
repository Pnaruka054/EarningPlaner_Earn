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

const io = socketIo(server, {
    cors: {
        origin: 'https://earningplaner-earn.onrender.com/login', // Allow your frontend URL here
        methods: ['GET', 'POST'],
        credentials: true, // Allow cookies if needed
    }
});
const allowedOrigins = [
    'https://earningplaner-earn.onrender.com',
    'https://earningplaner-earn-admin.onrender.com',
    'http://localhost:5173',
    'http://192.168.1.2:5173',
    'http://localhost:5174'
];
app.set('trust proxy', true);
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);  // Allow request
        } else {
            callback(new Error('Not allowed by CORS'));  // Block request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};


// middlewares
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use(cookieParser());
app.use(express.json());

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
app.use(cors(corsOptions)); // CORS ko ek hi jagah set karo
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

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
