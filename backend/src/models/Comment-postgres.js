import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const Comment = sequelize.define('Comment', {
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_internal'
  }
}, {
  tableName: 'comments',
  indexes: [
    { fields: ['defect_id'] }
  ]
});

export default Comment;