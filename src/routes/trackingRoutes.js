const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');
// Publicly accessible for now (like many tracking pages), or add auth if strict.
// For updates, ideally use API Key auth for Webhooks. For demo, open/JWT.

router.get('/:shipment_id', trackingController.getTrackingTimeline);
router.post('/update', trackingController.addTrackingUpdate); // Webhook-like

module.exports = router;
