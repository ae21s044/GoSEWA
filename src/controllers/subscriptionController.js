const { SubscriptionPlan, UserSubscription, User, Product, Notification } = require('../models');

// Create Plan (Gaushala)
exports.createPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, name, price_per_cycle, frequency, duration_days } = req.body;

    const plan = await SubscriptionPlan.create({
        gaushala_id: userId,
        product_id,
        name,
        price_per_cycle,
        frequency,
        duration_days
    });

    res.status(201).json({ success: true, message: 'Subscription plan created', data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.findAll({
        where: { is_active: true },
        include: [
            { model: Product, attributes: ['name', 'unit_type'] },
            { model: User, attributes: ['full_name'] } // Gaushala
        ]
    });
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Subscribe (User)
exports.subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_id } = req.body;

    const plan = await SubscriptionPlan.findByPk(plan_id);
    if (!plan || !plan.is_active) {
        return res.status(404).json({ success: false, message: 'Plan not found or inactive' });
    }

    // Mock Payment Step for Subscription (Assume success)

    // Calculate End Date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);

    const subscription = await UserSubscription.create({
        user_id: userId,
        plan_id,
        end_date: endDate,
        status: 'ACTIVE'
    });

    // Notify Gaushala
    await Notification.create({
        user_id: plan.gaushala_id,
        type: 'SUBSCRIPTION_NEW',
        title: 'New Subscriber',
        message: `New subscription for plan: ${plan.name}`,
        metadata: { subscription_id: subscription.id }
    });

    res.status(201).json({ success: true, message: 'Subscribed successfully', data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get User Subscriptions
exports.getMySubscriptions = async (req, res) => {
  try {
    const userId = req.user.id;

    const subs = await UserSubscription.findAll({
        where: { user_id: userId },
        include: [
            { model: SubscriptionPlan, include: [Product] }
        ]
    });

    res.json({ success: true, data: subs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
