const express = require('express');
const multer = require('multer');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { parseSMS, parseStatement } = require('../controllers/transactionController');

// Multer setup to process file uploads in-memory. Perfect for immediate parsing 
// without storing files to disk permanently before analysis.
const upload = multer({ storage: multer.memoryStorage() });

// Applying verifyToken middleware to strictly protect these endpoints
router.post('/parse/sms', verifyToken, parseSMS);
router.post('/parse/statement', verifyToken, upload.single('statement'), parseStatement);

module.exports = router;
