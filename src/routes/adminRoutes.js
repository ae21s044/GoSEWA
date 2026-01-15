const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
console.log('Admin Routes Loaded');

// Middleware to check Admin Role
const requireAdmin = (req, res, next) => {
    console.log('DEBUG: requireAdmin check. User:', req.user);
    if (req.user && req.user.user_type === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Admin access required' });
    }
};

router.get('/ping', (req, res) => res.json({ msg: 'Pong' }));

router.use(authMiddleware);
router.use(requireAdmin);

router.get('/stats', adminController.getSystemStats);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/verify', adminController.verifyUser);

module.exports = router;
