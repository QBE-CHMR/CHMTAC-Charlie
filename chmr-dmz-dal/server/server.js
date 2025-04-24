import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ReportRouter from './routes/Report.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';

const app = express();

// Middleware
const cors = require('cors');
app.use(cors({ origin: '*' })); // Allow all origins (for testing purposes)

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/report", ReportRouter);
app.use('/report/management', managementRouter);

const PORT = process.env.Port || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
})
