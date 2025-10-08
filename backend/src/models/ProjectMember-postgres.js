import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  role: {
    type: DataTypes.ENUM('engineer', 'supervisor'),
    allowNull: false
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'assigned_at'
  }
}, {
  tableName: 'project_members',
  timestamps: false,
  indexes: [
    { fields: ['project_id'] },
    { fields: ['user_id'] },
    { unique: true, fields: ['project_id', 'user_id'] }
  ]
});

export default ProjectMember;