const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Shipment = require('./Shipment');

const ShipmentUpdate = sequelize.define('ShipmentUpdate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  shipment_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Shipment,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING, // e.g., 'OUT_FOR_DELIVERY', 'AT_HUB'
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING // e.g., 'Package arrived at Mumbai Hub'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ShipmentUpdate;
