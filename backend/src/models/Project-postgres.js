import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'start_date'
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'end_date'
  },
  status: {
    type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'cancelled'),
    defaultValue: 'planning'
  },
  managerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'manager_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'projects',
  indexes: [
    { fields: ['manager_id'] },
    { fields: ['status'] }
  ]
});

export default Project;