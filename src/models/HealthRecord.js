const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthRecord = sequelize.define('HealthRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cattle_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  record_type: {
    type: DataTypes.ENUM('VACCINATION', 'TREATMENT', 'CHECKUP', 'SURGERY'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  doctor_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00
  },
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  next_due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
  }
}, {
  timestamps: true
});

module.exports = HealthRecord;
