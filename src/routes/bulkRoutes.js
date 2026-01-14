const express = require('express');
const router = express.Router();
const bulkController = require('../controllers/bulkController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/request', bulkController.createRequest);
router.get('/requests', bulkController.getOpenRequests);
router.post('/quote', bulkController.submitQuote);
router.get('/request/:request_id/quotes', bulkController.getQuotes);
router.post('/accept', bulkController.acceptQuote);

module.exports = router;
