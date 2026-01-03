import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Trip from './Trip.js';

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip,
      key: 'id'
    }
  },
  city_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  arrival_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departure_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  order_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'destinations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default Destination;

