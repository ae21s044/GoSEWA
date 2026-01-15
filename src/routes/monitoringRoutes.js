const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('Monitoring Routes Loaded');

// Middleware to check Admin Role
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.user_type === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/metrics', monitoringController.getSystemMetrics);
router.get('/health', monitoringController.getHealthCheck);
router.get('/ping', (req, res) => res.json({ msg: 'Monitoring Pong' }));

module.exports = router;
