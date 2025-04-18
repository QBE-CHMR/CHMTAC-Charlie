import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from '../redisClient.js';
import CivValidateRequiredFields from '../middleware/CivValidateRequiredFields.js';
import DodValidateRequiredFields from '../middleware/DodValidateRequiredFields.js';
import { STATUS_ENUM } from '../constants/statusEnum.js';
import validateReport from '../middleware/validateReport.js';
import useragentfilter from '../useragentfilter.js'
import multer from 'multer';
import path from 'path';
import rateLimiter from '../middleware/rateLimiter.js';
import { fileURLToPath } from 'url';

const ReportRouter = express.Router();

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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // Limit file size to 5GB
});

function captureInfo(req,res,next){

    const ipaddress = req.ip;
    const devicetype = "";
    const routeAccessed = req.originalURL || req.url;

    req.visitorData = {
        ipaddress,
        devicetype,
        routeAccessed,
        accessedAT: new Date().toISOString(),
    };

    next();
}

function pickValidator(req, res, next) {
  const t = (req.query.type || "").toUpperCase();
  if (t === "DOD")      return DodValidateRequiredFields(req, res, next);
  if (t === "CIVILIAN") return CivValidateRequiredFields(req, res, next);
  return res.status(400).json({ error: "must be DOD or CIVILIAN" });
}

async function submitReport(req,res){

    try{
        const type = req.query.type.toUpperCase();
        const reportID = uuidv4();

        let filereferences = [];
        if (req.files && req.files.length > 0) {
            filereferences = req.files.map((file) => file.filename);
   }

   const reportData = {
    id: reportID,
    ...req.body,
    ...req.visitorData,
    contactType: type,
    status: STATUS_ENUM.Submitted,
    filereferences,
    submittedAt: new Date().toISOString(),
    confidence_level: parseInt(process.env.CONFIDENCE_LEVEL, 10) || 1, // Default to civilian if not set
  };
  // Log the data before storing it in Redis
  console.log(`Storing ${type} Report Data:`, reportData);

  // Store data in Redis
  const keyPrefix = type === "DOD" ? "DoD Report:" : "Civilian Report:";
  await redisClient.set(`${keyPrefix}${reportID}`, JSON.stringify(reportData));
  

  return res.status(200).json({
    message: 'Report Submitted!',
    reportID,
  });
 } catch (err) {
   console.error('Error', err);
   return res.status(500).json({ error: 'Server Error' });
 }
}

ReportRouter.post(
    '/',
    rateLimiter, // Apply rate limiting
    pickValidator, // Validate required fields
    validateReport, // Validate report structure
    useragentfilter, // Filter based on user-agent
    captureInfo, // Log request details
    upload.array('files', 10), // Handle file uploads
    submitReport // Handle the core business logic
  );

ReportRouter.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: 'Server Error' });
  }
  next();
});

export default ReportRouter;

    
