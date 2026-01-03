import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Destination from './Destination.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  destination_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Destination,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  time_slot: {
    type: DataTypes.TIME,
    allowNull: true
  },
  is_booked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'activities',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Activity;

