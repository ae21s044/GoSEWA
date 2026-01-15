const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/collection', wasteController.logWaste);
router.post('/production', wasteController.logProduction);
router.get('/summary', wasteController.getSummary);

module.exports = router;
