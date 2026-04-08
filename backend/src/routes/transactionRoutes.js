const express = require('express');
const multer = require('multer');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { 
  parseSMS, 
  parseStatement, 
  saveParsedTransaction, 
  fetchUserTransactions 
} = require('../controllers/transactionController');

// Multer setup to process file uploads in-memory. Perfect for immediate parsing 
// without storing files to disk permanently before analysis.
const upload = multer({ storage: multer.memoryStorage() });

// Applying verifyToken middleware to strictly protect these endpoints
router.post('/parse/sms', verifyToken, parseSMS);
router.post('/parse/statement', verifyToken, upload.single('statement'), parseStatement);

// User-Specific Database Transaction APIs
router.post('/save', verifyToken, saveParsedTransaction);
router.get('/history', verifyToken, fetchUserTransactions);

module.exports = router;
