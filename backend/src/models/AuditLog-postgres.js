import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  resourceType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'resource_type'
  },
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'resource_id'
  },
  oldValues: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'old_values'
  },
  newValues: {
    type: DataTypes.JSONB,
    allowNull: true,
    field: 'new_values'
  },
  ipAddress: {
    type: DataTypes.INET,
    allowNull: true,
    field: 'ip_address'
  },
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent'
  }
}, {
  tableName: 'audit_logs',
  updatedAt: false,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['resource_type', 'resource_id'] }
  ]
});

export default AuditLog;