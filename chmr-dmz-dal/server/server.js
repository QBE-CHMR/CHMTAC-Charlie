import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ReportRouter from './routes/Report.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';

console.log('Environment Variables:', process.env);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/report", ReportRouter);
app.use('/report/management', managementRouter);

const PORT = process.env.Port || 5000;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

// Export the app for testing
export default app;