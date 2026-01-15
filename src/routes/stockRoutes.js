const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Cattle
router.post('/cattle', stockController.addCattle);
router.get('/cattle', stockController.getCattle);

// Health
router.post('/cattle/:id/health', stockController.addHealthRecord);

// Milk
router.post('/cattle/:id/milk', stockController.logMilkProduction);

module.exports = router;
