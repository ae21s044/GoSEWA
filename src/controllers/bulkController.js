const { BulkRequest, Quote, User, Product, Order, OrderItem, Notification, sequelize } = require('../models');
const { Op } = require('sequelize');

// Create Bulk Request
exports.createRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category_id, product_id, quantity_required, target_price_per_unit, description } = req.body;

    const request = await BulkRequest.create({
        entrepreneur_id: userId,
        category_id,
        product_id,
        quantity_required,
        target_price_per_unit,
        description
    });

    res.status(201).json({ success: true, message: 'Bulk request created', data: request });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Open Requests (For Gaushalas)
exports.getOpenRequests = async (req, res) => {
  try {
    const requests = await BulkRequest.findAll({
        where: { status: 'OPEN' },
        include: [
            { model: User, as: 'Entrepreneur', attributes: ['email'] }
        ],
        order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Submit Quote (Gaushala)
exports.submitQuote = async (req, res) => {
  try {
    const gaushalaId = req.user.id;
    const { bulk_request_id, price_per_unit, message } = req.body;

    const request = await BulkRequest.findByPk(bulk_request_id);
    if (!request || request.status !== 'OPEN') {
        return res.status(400).json({ success: false, message: 'Request not available' });
    }

    const total_amount = price_per_unit * request.quantity_required;

    const quote = await Quote.create({
        bulk_request_id,
        gaushala_id: gaushalaId,
        price_per_unit,
        total_amount,
        message
    });

    // Notify Entrepreneur
    await Notification.create({
        user_id: request.entrepreneur_id,
        type: 'QUOTE_RECEIVED',
        title: 'New Quote Received',
        message: `You received a quote of ₹${total_amount} for your bulk request.`,
        metadata: { bulk_request_id, quote_id: quote.id }
    });

    res.status(201).json({ success: true, message: 'Quote submitted', data: quote });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Quotes for a Request (Entrepreneur)
exports.getQuotes = async (req, res) => {
  try {
    const { request_id } = req.params;
    const userId = req.user.id; // Entrepreneur

    const quotes = await Quote.findAll({
        where: { bulk_request_id: request_id },
        include: [{ model: User, as: 'Gaushala', attributes: ['email'] }]
    });

    res.json({ success: true, data: quotes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Accept Quote -> Create Order (Entrepreneur)
exports.acceptQuote = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { quote_id } = req.body;
    const userId = req.user.id;

    const quote = await Quote.findByPk(quote_id, {
        include: [{ model: BulkRequest }]
    });

    if (!quote || quote.status !== 'PENDING') {
        return res.status(400).json({ success: false, message: 'Invalid quote' });
    }

    if (quote.BulkRequest.entrepreneur_id !== userId) {
        return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // 1. Create Order
    const order = await Order.create({
        entrepreneur_id: userId,
        gaushala_id: quote.gaushala_id,
        total_amount: quote.total_amount,
        order_status: 'PENDING',
        payment_status: 'PENDING'
    }, { transaction: t });

    // 2. Create Order Item (Proxy if no real Product ID, or link existing)
    // If BulkRequest had a product_id, use it. If not, we might need a placeholder or handle null.
    // For now, assume Product ID is desirable but if null, we create a specialized log? 
    // Constraint: OrderItem requires product_id.
    // Solution: If product_id is null, either require it in BulkRequest OR allow Order to have null items (unlikely).
    // Let's assume BulkRequest usually links to a Category/Product. If only Category, we select a Generic Product from Gaushala?
    // Simplified: Require BulkRequest to have product_id OR we pick the first matching product from Gaushala inventory in that category.
    // Fallback: Just putting the BulkRequest.product_id (nullable) -> if null, this might fail OrderItem constraint.
    // Let's handle: if request.product_id is null, we can't create standardized OrderItem easily without a Product reference.
    // *Workaround*: We won't create OrderItem if product_id is missing, just the Order header with description.
    
    // BUT OrderItem is key for stats.
    // Let's assume the user selects a specific product ID during creation OR we map it here.
    
    // Validating:
    if (quote.BulkRequest.product_id) {
         await OrderItem.create({
            order_id: order.id,
            product_id: quote.BulkRequest.product_id,
            quantity: quote.BulkRequest.quantity_required,
            price_per_unit: quote.price_per_unit,
            subtotal: quote.total_amount
        }, { transaction: t });
    }

    // 3. Update Statuses
    await quote.update({ status: 'ACCEPTED' }, { transaction: t });
    await quote.BulkRequest.update({ status: 'FULFILLED' }, { transaction: t });

    // 4. Notification
    await Notification.create({
        user_id: quote.gaushala_id,
        type: 'ORDER_RECEIVED',
        title: 'Bulk Quote Accepted',
        message: `Your quote for ${quote.BulkRequest.quantity_required} units was accepted. Order #${order.id} created.`,
        metadata: { order_id: order.id }
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Quote accepted, Order created', data: order });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, error: error.message });
  }
};
