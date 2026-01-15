const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const ByProductProduction = sequelize.define('ByProductProduction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gaushala_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  product_type: {
    type: DataTypes.ENUM('BIOGAS', 'VERMICOMPOST', 'SLURRY', 'PEST_REPELLENT', 'DUNG_LOGS'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  unit: {
    type: DataTypes.ENUM('M3', 'KG', 'LITER'),
    allowNull: false
  },
  batch_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = ByProductProduction;
