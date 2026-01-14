const { Shipment, ShipmentUpdate, Notification, Order } = require('../models');

// Add Tracking Update (Webhook or Manual)
exports.addTrackingUpdate = async (req, res) => {
  try {
    const { shipment_id, status, location, description } = req.body;
    
    // 1. Verify Shipment Exists
    const shipment = await Shipment.findByPk(shipment_id, {
        include: [{ model: Order }]
    });

    if (!shipment) {
        return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    // 2. Create Update
    const update = await ShipmentUpdate.create({
        shipment_id, status, location, description
    });

    // 3. Update Parent Shipment Status
    await shipment.update({ status });

    // 4. Send Notification to Entrepreneur (Buyer)
    if (shipment.Order) {
        await Notification.create({
            user_id: shipment.Order.entrepreneur_id,
            type: 'SHIPMENT_UPDATE',
            title: `Shipment Update: ${status}`,
            message: `${description} (${location})`,
            metadata: { shipment_id, order_id: shipment.order_id }
        });
    }

    res.status(201).json({ success: true, message: 'Tracking updated', data: update });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Tracking Timeline
exports.getTrackingTimeline = async (req, res) => {
  try {
    const { shipment_id } = req.params;

    const updates = await ShipmentUpdate.findAll({
        where: { shipment_id },
        order: [['timestamp', 'DESC']]
    });

    const shipment = await Shipment.findByPk(shipment_id);

    res.json({ 
        success: true, 
        data: {
            shipment,
            timeline: updates
        }
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
