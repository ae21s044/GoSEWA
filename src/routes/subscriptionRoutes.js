const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/plans', subscriptionController.createPlan);
router.get('/plans', subscriptionController.getPlans);
router.post('/subscribe', subscriptionController.subscribe);
router.get('/my', subscriptionController.getMySubscriptions);

module.exports = router;
