const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Product = require('./Product');

const BulkRequest = sequelize.define('BulkRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  entrepreneur_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  category_id: { // General Requirement (e.g., Any Cow Dung Logs)
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    }
  },
  product_id: { // Specific Product Requirement (Optional)
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity_required: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  target_price_per_unit: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'CLOSED', 'FULFILLED'),
    defaultValue: 'OPEN'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = BulkRequest;
