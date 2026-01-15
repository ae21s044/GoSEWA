const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/optimize', routeController.optimizeRoute);
router.get('/:id', routeController.getRouteDetails);
router.put('/:id/status', routeController.updateRouteStatus);

module.exports = router;
