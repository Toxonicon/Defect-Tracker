import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const Defect = sequelize.define('Defect', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('structural', 'electrical', 'plumbing', 'finishing', 'safety', 'other'),
    allowNull: false
  },
  severity: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'review', 'resolved', 'closed', 'rejected'),
    defaultValue: 'open'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  floor: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  room: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  reportedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'reported_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  assignedTo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'assigned_to',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'due_date'
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'resolved_at'
  }
}, {
  tableName: 'defects',
  indexes: [
    { fields: ['project_id'] },
    { fields: ['status'] },
    { fields: ['severity'] },
    { fields: ['assigned_to'] },
    { fields: ['reported_by'] }
  ]
});

export default Defect;