const express = require('express');
const router = express.Router();
const matchingController = require('../controllers/matchingController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/match', matchingController.findMatches);

module.exports = router;
