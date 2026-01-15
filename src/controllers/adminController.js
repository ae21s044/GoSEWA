const { User, Order, Payment, GaushalaProfile } = require('../models');
const { Op } = require('sequelize');

exports.getSystemStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalEntrepreneurs = await User.count({ where: { user_type: 'ENTREPRENEUR' } });
        const totalGaushalas = await User.count({ where: { user_type: 'GAUSHALA' } });

        const totalOrders = await Order.count();
        const pendingOrders = await Order.count({ where: { order_status: 'PENDING' } });

        // Sum total revenue from completed/confirmed orders or payments
        // Assuming Payment table has status 'COMPLETED' or 'SUCCESS'
        // For MVP, using Order total_amount where status is DELIVERED or CONFIRMED
        const revenueData = await Order.sum('total_amount', {
            where: { order_status: { [Op.in]: ['CONFIRMED', 'DELIVERED'] } }
        });

        res.json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    entrepreneurs: totalEntrepreneurs,
                    gaushalas: totalGaushalas
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders
                },
                financials: {
                    total_revenue: revenueData || 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { user_type, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const where = {};
        if (user_type) where.user_type = user_type;

        const users = await User.findAndCountAll({
            where,
            attributes: ['id', 'email', 'phone', 'user_type', 'is_verified', 'created_at'],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                total: users.count,
                pages: Math.ceil(users.count / limit),
                current_page: parseInt(page),
                users: users.rows
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'APPROVE' or 'REJECT'

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (action === 'APPROVE') {
            await user.update({ is_verified: true });
            return res.json({ success: true, message: 'User verified successfully' });
        } else if (action === 'REJECT') {
             await user.update({ is_verified: false }); // Or keep false
             return res.json({ success: true, message: 'User rejected/unverified' });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action' });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
