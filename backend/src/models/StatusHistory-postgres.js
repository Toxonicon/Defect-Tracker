import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const StatusHistory = sequelize.define('StatusHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  defectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'defect_id',
    references: {
      model: 'defects',
      key: 'id'
    }
  },
  previousStatus: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'previous_status'
  },
  newStatus: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'new_status'
  },
  changedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'changed_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  changeReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'change_reason'
  },
  changedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'changed_at'
  }
}, {
  tableName: 'status_history',
  timestamps: false,
  indexes: [
    { fields: ['defect_id'] }
  ]
});

export default StatusHistory;