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
const userRouter = require('./routes/user_router');
const userWithdraw = require('./routes/userWIthdraw_router');
const userIncomeRoute = require('./routes/userIncome_router');
const { cronForDaily_MonthlyData_Update } = require('./helper/cronJobs')

const io = socketIo(server, {
    cors: {
        origin: 'https://earningplaner-earn.onrender.com/login', // Allow your frontend URL here
        methods: ['GET', 'POST'],
        credentials: true, // Allow cookies if needed
    }
});
const allowedOrigins = [
    'https://earningplaner-earn.onrender.com',
    'http://localhost:5173',
    'http://192.168.1.2:5173'
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
app.use(cors(corsOptions));
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


// route middlewares
app.use(middleware.middleware_userLogin_check)
app.use('/userRoute', userRouter);
app.use('/userWithdraw', userWithdraw);
app.use('/userIncomeRoute', userIncomeRoute);

// Scheduled cron tasks
cronForDaily_MonthlyData_Update()

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
