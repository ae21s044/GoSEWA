const { User, Notification, Order, Cart, Product, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAppConfig = (req, res) => {
    // Public endpoint for app startup
    res.json({
        success: true,
        data: {
            min_version: '1.0.0',
            latest_version: '1.2.0',
            maintenance_mode: false,
            features: {
                payment_enabled: true,
                live_tracking: true
            },
            support_email: 'support@gosewa.com'
        }
    });
};

exports.getHomeScreen = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.user_type; // 'ENTREPRENEUR' or 'GAUSHALA'

        // 1. Unread Notifications
        const unreadCount = await Notification.count({
            where: { user_id: userId, is_read: false }
        });

        // 2. Active Orders (Pending/Confirmed/Shipped)
        const activeOrdersCount = await Order.count({
            where: {
                [userType === 'GAUSHALA' ? 'gaushala_id' : 'entrepreneur_id']: userId,
                order_status: { [Op.notIn]: ['DELIVERED', 'CANCELLED'] }
            }
        });

        // 3. Cart Count (Entrepreneur only, usually)
        let cartCount = 0;
        if (userType === 'ENTREPRENEUR') {
            const cart = await Cart.findOne({ where: { user_id: userId } });
            if (cart) cartCount = cart.item_count;
        }

        // 4. Featured/Recent Products
        const featuredProducts = await Product.findAll({
            where: { is_available: true },
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'name', 'price_per_unit', 'unit_type', 'quality_grade', 'available_quantity']
        });

        res.json({
            success: true,
            data: {
                profile: {
                    id: req.user.id,
                    email: req.user.email,
                    role: userType, // Keeping key 'role' for frontend consistency if needed
                    user_type: userType,
                    name: req.user.full_name // Assuming present or needed
                },
                stats: {
                    unread_notifications: unreadCount,
                    active_orders: activeOrdersCount,
                    cart_items: cartCount
                },
                featured_products: featuredProducts
            }
        });

    } catch (error) {
        console.error('Mobile Home Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
