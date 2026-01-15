const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ColdChainLog = sequelize.define('ColdChainLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  shipment_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  vehicle_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  temperature_celsius: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  humidity_percent: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  location_lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  location_lon: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  updatedAt: false
});

module.exports = ColdChainLog;
