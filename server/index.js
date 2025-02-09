require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const cron = require('node-cron');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'https://earningplaner-earn.onrender.com/login', // Allow your frontend URL here
        methods: ['GET', 'POST'],
        credentials: true, // Allow cookies if needed
    }
});
const cookieParser = require('cookie-parser');
const { createCurrentMonthDocuments } = require("./controllers/dashboardStatistics/dashboardStatistics");
const middleware = require('./middlewares/jwt_to_userData_middleware')
const userRouter = require('./routes/user_router');
const userWithdraw = require('./routes/userWIthdraw_router');

const corsOptions = {
    origin: 'https://earningplaner-earn.onrender.com',  // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

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

app.use(middleware.middleware_userLogin_check)
app.use('/userRoute', userRouter);
app.use('/userWithdraw', userWithdraw);

// Scheduled task
cron.schedule('0 0 1 * *', () => {
    createCurrentMonthDocuments();
    console.log('Monthly check for document creation executed');
});

// Server listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
