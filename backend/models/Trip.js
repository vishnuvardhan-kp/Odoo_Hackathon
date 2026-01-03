import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  budget_limit: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  cover_photo: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  share_token: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: true
  }
}, {
  tableName: 'trips',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Trip;

