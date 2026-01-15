const { DeliveryRoute, RouteStop, Order, Vehicle, User, Address } = require('../models');

// Mock route optimization logic
exports.optimizeRoute = async (req, res) => {
  try {
    const { vehicle_id, order_ids } = req.body;
    const transporter_id = req.user.id; // Authenticated transporter

    // Validate inputs
    if (!order_ids || !Array.isArray(order_ids) || order_ids.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of order IDs.' });
    }

    // Verify Vehicle ownership
    const vehicle = await Vehicle.findOne({ where: { id: vehicle_id, transporter_id } });
    if (!vehicle) {
      return res.status(403).json({ error: 'Vehicle not found or does not belong to you.' });
    }

    // Fetch Orders to ensure they exist and get addresses (mock logic here)
    const orders = await Order.findAll({
      where: { id: order_ids },
      include: [{ model: User, as: 'Entrepreneur', include: [Address] }] // Assuming we deliver to Entrepreneur's address? OR Shipment address. For MVP, keeping it simple.
    });

    if (orders.length !== order_ids.length) {
      return res.status(400).json({ error: 'One or more Order IDs are invalid.' });
    }

    // --- MOCK OPTIMIZATION LOGIC ---
    // In a real app, we'd use Google Maps API or OSRM here.
    // We'll just shuffle the orders to simulate "reordering" for optimization.
    const optimizedOrderSequence = [...orders].sort(() => 0.5 - Math.random());

    // Calculate mock totals
    const totalDistance = Math.floor(Math.random() * 50) + 10; // 10-60 km
    const totalDuration = Math.floor(Math.random() * 120) + 30; // 30-150 mins

    // Create the Route
    const route = await DeliveryRoute.create({
      transporter_id,
      vehicle_id,
      total_distance_km: totalDistance,
      total_duration_mins: totalDuration,
      status: 'PLANNED'
    });

    // Create Route Stops
    const routeStops = [];
    for (let i = 0; i < optimizedOrderSequence.length; i++) {
        const order = optimizedOrderSequence[i];
        
        // Mock ETA: Current time + i * 30 mins
        const eta = new Date();
        eta.setMinutes(eta.getMinutes() + (i + 1) * 30);

        const stop = await RouteStop.create({
            route_id: route.id,
            order_id: order.id,
            stop_sequence_number: i + 1,
            estimated_arrival_time: eta
        });
        routeStops.push(stop);
    }

    res.status(201).json({
      message: 'Route optimized and created successfully.',
      route,
      stops: routeStops
    });

  } catch (error) {
    console.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRouteDetails = async (req, res) => {
    try {
        const route_id = req.params.id;
        
        const route = await DeliveryRoute.findByPk(route_id, {
            include: [
                {
                    model: RouteStop,
                    as: 'Stops',
                    include: [{ model: Order, attributes: ['id', 'order_status', 'total_amount'] }]
                },
                { model: Vehicle }
            ],
            order: [[ { model: RouteStop, as: 'Stops' }, 'stop_sequence_number', 'ASC' ]]
        });

        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }

        // Access Control
        if (route.transporter_id !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied.' });
        }

        res.json(route);
    } catch (error) {
        console.error('Error fetching route details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateRouteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const route_id = req.params.id;

        const route = await DeliveryRoute.findByPk(route_id);
         if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }

         if (route.transporter_id !== req.user.id) {
            return res.status(403).json({ error: 'Access denied.' });
        }

        route.status = status;
        await route.save();

        res.json({ message: 'Route status updated', route });

    } catch (error) {
        console.error('Error updating route status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
