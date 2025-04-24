import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ReportRouter from './routes/Report.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';
import path from "path";

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods for now
  credentials: true, // Allow cookies if needed
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/files", express.static(path.resolve("files")));

app.use("/report", ReportRouter);
app.use('/report/management', managementRouter);

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
