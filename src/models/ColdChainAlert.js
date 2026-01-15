const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ColdChainAlert = sequelize.define('ColdChainAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  log_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipment_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  alert_type: {
    type: DataTypes.ENUM('TEMP_HIGH', 'TEMP_LOW', 'HUMIDITY_HIGH', 'HUMIDITY_LOW'),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'ACKNOWLEDGED', 'RESOLVED'),
    defaultValue: 'OPEN'
  }
}, {
  timestamps: true
});

module.exports = ColdChainAlert;
