import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import ReportRouter from './routes/Report.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';
import path from 'path';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/files', express.static(path.resolve('files')));
app.use('/report', ReportRouter);
app.use('/report/management', managementRouter);

export default app; // Export the app instance

// Start the server only if this file is executed directly
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.Port || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}