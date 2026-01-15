const { ColdChainLog, ColdChainAlert, Shipment, Vehicle } = require('../models');

// Thresholds (Simplified for MVP)
const THRESHOLDS = {
    temp_min: 2.0,
    temp_max: 8.0, // e.g., for milk
    humidity_min: 30.0,
    humidity_max: 90.0
};

exports.addLog = async (req, res) => {
    try {
        const { shipment_id, vehicle_id, temperature_celsius, humidity_percent, location_lat, location_lon } = req.body;

        // Basic Validation
        if (!temperature_celsius) {
            return res.status(400).json({ error: 'Temperature is required.' });
        }

        // Create Log
        const log = await ColdChainLog.create({
            shipment_id,
            vehicle_id,
            temperature_celsius,
            humidity_percent,
            location_lat,
            location_lon
        });

        // Check for Alerts
        const alerts = [];
        
        if (temperature_celsius > THRESHOLDS.temp_max) {
             const alert = await ColdChainAlert.create({
                 log_id: log.id,
                 shipment_id,
                 alert_type: 'TEMP_HIGH',
                 message: `Temperature High: ${temperature_celsius}°C (Max: ${THRESHOLDS.temp_max}°C)`
             });
             alerts.push(alert);
        } else if (temperature_celsius < THRESHOLDS.temp_min) {
            const alert = await ColdChainAlert.create({
                log_id: log.id,
                shipment_id,
                alert_type: 'TEMP_LOW',
                message: `Temperature Low: ${temperature_celsius}°C (Min: ${THRESHOLDS.temp_min}°C)`
            });
            alerts.push(alert);
        }

        res.status(201).json({
            message: 'Log recorded successfully.',
            log,
            alerts_generated: alerts.length > 0,
            alerts
        });

    } catch (error) {
        console.error('Error adding cold chain log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getShipmentLogs = async (req, res) => {
    try {
        const { id } = req.params; // Shipment ID
        
        const logs = await ColdChainLog.findAll({
            where: { shipment_id: id },
            order: [['recorded_at', 'ASC']],
            include: [{ model: ColdChainAlert }]
        });

        res.json({ logs });
    } catch (error) {
        console.error('Error getting shipment logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
       // Filter by User's vehicle or shipment? 
       // For MVP, user (Transporter) sees alerts for their shipments/vehicles.
       // Requires complex join or just returning all for demo if admin.
       // Let's assume generic access for now or pass shipment_id query param.
       
       const where = {};
       if (req.query.shipment_id) where.shipment_id = req.query.shipment_id;

       const alerts = await ColdChainAlert.findAll({
           where,
           order: [['createdAt', 'DESC']],
           include: [{ model: ColdChainLog }]
       });

       res.json({ alerts });

    } catch (error) {
        console.error('Error getting alerts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
