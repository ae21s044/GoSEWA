const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const WasteCollection = sequelize.define('WasteCollection', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  gaushala_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  waste_type: {
    type: DataTypes.ENUM('DUNG', 'URINE'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  unit: {
    type: DataTypes.ENUM('KG', 'LITER'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = WasteCollection;
