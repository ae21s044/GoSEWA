const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DeliveryRoute = sequelize.define('DeliveryRoute', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transporter_id: {
    type: DataTypes.UUID, // User ID of transporter
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  start_location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Hub'
  },
  end_location: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Hub'
  },
  total_distance_km: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_duration_mins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'PLANNED'
  }
}, {
  timestamps: true
});

module.exports = DeliveryRoute;
