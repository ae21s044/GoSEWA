const express = require('express');
const router = express.Router();
const mobileController = require('../controllers/mobileController');
const authMiddleware = require('../middleware/authMiddleware');

// Public Configuration
router.get('/config', mobileController.getAppConfig);

// Protected Home Screen
router.get('/home', authMiddleware, mobileController.getHomeScreen);

module.exports = router;
