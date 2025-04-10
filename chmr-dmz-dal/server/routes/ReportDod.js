import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../redisClient.js';
import DodValidateRequiredFields from '../middleware/DodValidateRequiredFields.js';
import validateReport from '../middleware/validateReport.js';
import useragentfilter from '../useragentfilter.js'
import multer from 'multer';
import path from 'path';
import { STATUS_ENUM } from '../constants/statusEnum.js';
import rateLimiter from '../middleware/rateLimiter.js';
import { fileURLToPath } from 'url';

const dod_router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filesDir = path.join(__dirname, '..', '..', 'files');
    cb(null, filesDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });



 function captureInfo(req,res,next){

    const ipaddress = req.ip;
    const devicetype = " ";
    const routeAccessed = req.originalURL || req.url;

    req.visitorData = {
        ipaddress,
        devicetype,
        routeAccessed,
        accessedAT: new Date().toISOString(),
    };

    next();
}

async function submitReportdod(req, res) {
 try {
  
   const {ipaddress,devicetype,routeAccessed, accessedAT} = req.visitorData || {};
   const {
    full_name,
    phone_number,
    phone_dsn,
    email_address,
    reporting_unit,
    duty_title,
    duty_type,
    duty_rank,
    assigned_unit,
    combat_command,
    other_command,
    location,
    start_datetime,
    end_datetime,
    time_zone,
    total_harm,
    us_harm,
    information_url,
    poc_1_name,
    poc_1_info,
    poc_2_name,
    poc_2_info,
    honeypot, 
   } = req.body;

   // Generate a unique ID for the report
   const reportID = uuidv4();

   let filereferences = [];
   if (req.files && req.files.length > 0) {
     filereferences = req.files.map((file) => file.filename);
   }

   // Build the data object
   const reportData = {
     id: reportID,
     ...req.body,
     ipaddress,
     devicetype,
     status: STATUS_ENUM.INITIALIZED,
     routeAccessed,
     accessedAT,
     filereferences,
     submittedAt: new Date().toISOString(),
   };

  // Log the data before storing it in Redis
  console.log('Storing DoD Report Data:', reportData);

  // Store data in Redis
  await redisClient.set(`Report:${reportID}`, JSON.stringify(reportData));

  return res.status(200).json({
    message: 'Report Submitted!',
    reportID,
  });
 } catch (err) {
   console.error('Error', err);
   return res.status(500).json({ error: 'Server Error' });
 }
}

dod_router.post(
  '/',
  rateLimiter, // Apply rate limiting
  upload.array('files', 10), // Handle file uploads
  DodValidateRequiredFields, // Validate required fields
  validateReport, // Validate report structure
  useragentfilter, // Filter based on user-agent
  captureInfo, // Log request details
  submitReportdod // Handle the core business logic
);

export default dod_router;
