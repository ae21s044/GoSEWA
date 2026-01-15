const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RouteStop = sequelize.define('RouteStop', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stop_sequence_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estimated_arrival_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED', 'SKIPPED'),
    defaultValue: 'PENDING'
  }
}, {
  timestamps: true
});

module.exports = RouteStop;
