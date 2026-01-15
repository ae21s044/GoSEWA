const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
console.log('Report Routes Loaded');

router.get('/ping', (req, res) => res.json({ msg: 'Report Pong' }));

router.use(authMiddleware);

router.get('/sales', reportController.getSalesReport);
router.get('/inventory', reportController.getInventoryReport);
router.get('/impact', reportController.getImpactReport);

module.exports = router;
