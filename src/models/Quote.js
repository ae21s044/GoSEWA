const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const BulkRequest = require('./BulkRequest');

const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bulk_request_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: BulkRequest,
      key: 'id'
    }
  },
  gaushala_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  price_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
    defaultValue: 'PENDING'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Quote;
