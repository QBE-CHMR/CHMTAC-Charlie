import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import civilianRouter from './routes/ReportCivilian.js';
import dodRouter from './routes/ReportDod.js';
import managementRouter from './routes/ReportManagement.js';
import './redisClient.js';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

// Route to send CSRF token to the frontend
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


app.use('/report/civilian', csrfProtection, civilianRouter);
app.use('/report/dod', csrfProtection, dodRouter);
app.use('/report/management', csrfProtection, managementRouter);

const PORT = process.env.Port || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
