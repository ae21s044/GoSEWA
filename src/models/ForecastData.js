const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ForecastData = sequelize.define('ForecastData', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gaushala_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  forecast_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  predicted_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  confidence_score: {
    type: DataTypes.FLOAT, // 0.0 to 1.0
    defaultValue: 0.8
  }
}, {
  timestamps: true
});

module.exports = ForecastData;
