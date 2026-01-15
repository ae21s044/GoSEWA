const { Order, Product, WasteCollection, User, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, format } = req.query;
        const gaushalaId = req.user.user_type === 'GAUSHALA' ? req.user.id : null;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.created_at = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const where = {
            order_status: { [Op.in]: ['CONFIRMED', 'DELIVERED'] }, // Paid/Committed orders
            ...dateFilter
        };

        if (gaushalaId) {
            where.gaushala_id = gaushalaId;
        }

        // Group by Date (simplistic approach: just list or simple aggregation)
        // For accurate daily grouping in SQLite/MySQL, standard SQL syntax varies. 
        // We'll fetch all and aggregate in JS for DB neutrality in this MVP/Test environment.
        const orders = await Order.findAll({
            where,
            attributes: ['id', 'total_amount', 'created_at']
        });

        // Aggregation
        const salesByDate = {};
        let totalRevenue = 0;
        let totalOrders = 0;

        orders.forEach(order => {
            const date = new Date(order.created_at).toISOString().split('T')[0];
            totalRevenue += parseFloat(order.total_amount);
            totalOrders++;
            if (!salesByDate[date]) salesByDate[date] = 0;
            salesByDate[date] += parseFloat(order.total_amount);
        });

        const reportData = {
            period: { startDate, endDate },
            summary: { totalRevenue, totalOrders },
            daily_breakdown: salesByDate
        };

        if (format === 'csv') {
            let csv = 'Date,Revenue\n';
            Object.keys(salesByDate).forEach(date => {
                csv += `${date},${salesByDate[date]}\n`;
            });
            res.header('Content-Type', 'text/csv');
            res.attachment('sales_report.csv');
            return res.send(csv);
        }

        res.json({ success: true, data: reportData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getInventoryReport = async (req, res) => {
    try {
        const gaushalaId = req.user.user_type === 'GAUSHALA' ? req.user.id : null;
        
        const productWhere = {};
        if (gaushalaId) productWhere.gaushala_id = gaushalaId;

        const products = await Product.findAll({
            where: productWhere,
            attributes: ['id', 'name', 'available_quantity', 'unit_type', 'price_per_unit']
        });

        // Low stock threshold
        const LOW_STOCK_LIMIT = 50; 
        const lowStockItems = products.filter(p => p.available_quantity < LOW_STOCK_LIMIT);
        
        // Calculate total valuation
        let totalValuation = 0;
        products.forEach(p => totalValuation += (p.available_quantity * p.price_per_unit));

        res.json({
            success: true,
            data: {
                total_products: products.length,
                total_valuation: totalValuation,
                low_stock_count: lowStockItems.length,
                low_stock_items: lowStockItems.map(p => ({ name: p.name, qty: p.available_quantity })),
                inventory_list: products
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getImpactReport = async (req, res) => {
    try {
        const gaushalaId = req.user.user_type === 'GAUSHALA' ? req.user.id : null;
        const wasteWhere = {};
        if (gaushalaId) wasteWhere.gaushala_id = gaushalaId;

        const waste = await WasteCollection.findAll({
            where: wasteWhere,
            attributes: ['quantity', 'waste_type']
        });

        let totalWasteProcessed = 0;
        waste.forEach(w => totalWasteProcessed += parseFloat(w.quantity));

        // Sustainability Metrics
        // Assumption: 1kg Cow Dung treated prevents X kg CO2 vs open dumping. 
        // Mock factor: 0.5 kg CO2 per kg waste.
        const co2Saved = totalWasteProcessed * 0.5;
        const compostGenerated = totalWasteProcessed * 0.4; // 40% conversion rate mock

        res.json({
            success: true,
            data: {
                total_waste_processed_kg: totalWasteProcessed,
                impact_metrics: {
                    co2_emissions_prevented_kg: co2Saved,
                    potential_compost_generated_kg: compostGenerated,
                    sustainability_score: Math.min(100, Math.floor(co2Saved / 10)) // dynamic score
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
