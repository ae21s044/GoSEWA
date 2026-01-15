const { WasteCollection, ByProductProduction, sequelize } = require('../models');

exports.logWaste = async (req, res) => {
    try {
        const { date, waste_type, quantity, unit } = req.body;

        const collection = await WasteCollection.create({
            gaushala_id: req.user.id,
            date,
            waste_type,
            quantity,
            unit
        });

        res.status(201).json({ success: true, message: 'Waste collection logged', data: collection });

    } catch (error) {
        console.error('Error logging waste:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.logProduction = async (req, res) => {
    try {
        const { date, product_type, quantity, unit, batch_id } = req.body;

        const production = await ByProductProduction.create({
            gaushala_id: req.user.id,
            date,
            product_type,
            quantity,
            unit,
            batch_id
        });

        res.status(201).json({ success: true, message: 'Byproduct production logged', data: production });

    } catch (error) {
        console.error('Error logging production:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getSummary = async (req, res) => {
    try {
        // Aggregate total waste collected
        const wasteTotals = await WasteCollection.findAll({
            where: { gaushala_id: req.user.id },
            attributes: [
                'waste_type',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
                'unit'
            ],
            group: ['waste_type', 'unit']
        });

        // Aggregate total byproduct produced
        const productionTotals = await ByProductProduction.findAll({
            where: { gaushala_id: req.user.id },
            attributes: [
                'product_type',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
                'unit'
            ],
            group: ['product_type', 'unit']
        });

        res.json({
            success: true,
            data: {
                waste_collected: wasteTotals,
                byproducts_produced: productionTotals
            }
        });

    } catch (error) {
        console.error('Error getting summary:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
