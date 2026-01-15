const express = require('express');
const router = express.Router();
const coldChainController = require('../controllers/coldChainController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/logs', coldChainController.addLog);
router.get('/shipment/:id/logs', coldChainController.getShipmentLogs); // Updated path for clarity
router.get('/alerts', coldChainController.getAlerts);

module.exports = router;
