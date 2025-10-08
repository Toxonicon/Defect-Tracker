import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database-postgres.js';

const Attachment = sequelize.define('Attachment', {
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
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'original_name'
  },
  filePath: {
    type: DataTypes.STRING(500),
    allowNull: false,
    field: 'file_path'
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'file_size'
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'mime_type'
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'uploaded_by',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'uploaded_at'
  }
}, {
  tableName: 'attachments',
  timestamps: false,
  indexes: [
    { fields: ['defect_id'] }
  ]
});

export default Attachment;