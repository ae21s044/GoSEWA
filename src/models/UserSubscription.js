const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const SubscriptionPlan = require('./SubscriptionPlan');

const UserSubscription = sequelize.define('UserSubscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  plan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SubscriptionPlan,
      key: 'id'
    }
  },
  start_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'EXPIRED', 'CANCELLED'),
    defaultValue: 'ACTIVE'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = UserSubscription;
