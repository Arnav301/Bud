const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { getProfile } = require('../controllers/authController');

// All routes here will use the verifyToken middleware to ensure the user is authenticated via Firebase
router.get('/profile', verifyToken, getProfile);

module.exports = router;
