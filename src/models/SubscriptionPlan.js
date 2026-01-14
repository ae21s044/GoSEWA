const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gaushala_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price_per_cycle: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('DAILY', 'WEEKLY', 'MONTHLY'),
    defaultValue: 'DAILY'
  },
  duration_days: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SubscriptionPlan;
