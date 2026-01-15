const { ForecastData, Product, User } = require('../models');
const { Op } = require('sequelize');

exports.generateForecasts = async (req, res) => {
  try {
    // Determine target gaushala (admin can specify, otherwise uses authenticated user)
    // For simplicity efficiently, we'll assume the logged-in user is the gaushala
    // In a real app, we might pass a gaushala_id in the body for admin overrides
    const gaushalaId = req.user.id;

    // Check if user is a Gaushala
    if (req.user.role !== 'GAUSHALA') {
      return res.status(403).json({ error: 'Access denied. Only Gaushalas can generate forecasts.' });
    }

    // Get all products for this Gaushala
    const products = await Product.findAll({ where: { gaushala_id: gaushalaId } });

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found for this Gaushala to forecast.' });
    }

    const forecasts = [];
    const today = new Date();

    // Generate forecasts for the next 7 days for each product
    for (const product of products) {
      // Clear existing future forecasts to avoid duplicates
      await ForecastData.destroy({
        where: {
          product_id: product.id,
          forecast_date: {
            [Op.gte]: today
          }
        }
      });

      for (let i = 1; i <= 7; i++) {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + i);

        // Simple mock logic: random demand between 10 and 100
        const predictedQuantity = Math.floor(Math.random() * 91) + 10;
        
        // Mock confidence score between 0.70 and 0.99
        const confidenceScore = parseFloat((Math.random() * (0.99 - 0.70) + 0.70).toFixed(2));

        forecasts.push({
          gaushala_id: gaushalaId,
          product_id: product.id,
          forecast_date: forecastDate,
          predicted_quantity: predictedQuantity,
          confidence_score: confidenceScore
        });
      }
    }

    await ForecastData.bulkCreate(forecasts);

    res.status(201).json({
      message: 'Demand forecasts generated successfully for the next 7 days.',
      count: forecasts.length
    });

  } catch (error) {
    console.error('Error generating forecasts:', error);
    res.status(500).json({ error: 'Internal server error while generating forecasts' });
  }
};

exports.getForecasts = async (req, res) => {
  try {
    const gaushalaId = req.params.gaushala_id;

    // Authorization check: User can only view their own forecasts unless Admin (omitted for MVP simplicity)
    if (req.user.id !== gaushalaId && req.user.role !== 'ADMIN') {
       return res.status(403).json({ error: 'Access denied.' });
    }

    const forecasts = await ForecastData.findAll({
      where: {
        gaushala_id: gaushalaId,
        forecast_date: {
            [Op.gte]: new Date() // Only future forecasts
        }
      },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'category_id', 'price_per_unit']
      }],
      order: [['forecast_date', 'ASC']]
    });

    res.status(200).json(forecasts);
  } catch (error) {
    console.error('Error retrieving forecasts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
