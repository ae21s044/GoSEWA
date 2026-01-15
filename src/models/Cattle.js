const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Cattle = sequelize.define('Cattle', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  gaushala_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  tag_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE'),
    allowNull: false
  },
  health_status: {
    type: DataTypes.ENUM('HEALTHY', 'SICK', 'INJURED', 'PREGNANT', 'QUARANTINED'),
    defaultValue: 'HEALTHY'
  },
  milking_status: {
    type: DataTypes.ENUM('LACTATING', 'DRY', 'N/A'),
    defaultValue: 'N/A' // N/A for males or calves
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Cattle;
