import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import ReportRouter from './routes/Report.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods for now
  credentials: true, // Allow cookies if needed
}));
app.use(bodyParser.json());
app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Route to send CSRF token to the frontend
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


app.use("/report", csrfProtection, ReportRouter);
app.use('/report/management', csrfProtection, managementRouter);

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
