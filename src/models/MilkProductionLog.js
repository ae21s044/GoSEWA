const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MilkProductionLog = sequelize.define('MilkProductionLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cattle_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  morning_yield_liters: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  evening_yield_liters: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  fat_percentage: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = MilkProductionLog;
