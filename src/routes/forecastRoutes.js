const express = require('express');
const router = express.Router();
const forecastController = require('../controllers/forecastController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Generate forecasts (Gaushala only)
router.post('/generate', forecastController.generateForecasts);

// Get forecasts for a Gaushala
router.get('/:gaushala_id', forecastController.getForecasts);

module.exports = router;
