import mongoose from 'mongoose';

const defectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  category: {
    type: String,
    enum: ['structural', 'electrical', 'plumbing', 'hvac', 'safety', 'quality', 'other'],
    required: true
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['open', 'assigned', 'in-progress', 'testing', 'resolved', 'closed', 'rejected'], 
    default: 'open' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  project: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  reporter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  location: {
    building: String,
    floor: String,
    room: String,
    coordinates: {
      x: Number,
      y: Number
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now }
  }],
  estimatedHours: {
    type: Number,
    min: 0
  },
  actualHours: {
    type: Number,
    min: 0
  },
  dueDate: {
    type: Date
  },
  resolvedDate: {
    type: Date
  },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    timestamp: { type: Date, default: Date.now },
    isInternal: { type: Boolean, default: false }
  }],
  statusHistory: [{
    status: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    changedAt: { type: Date, default: Date.now },
    comment: String
  }]
}, {
  timestamps: true
});

// Индексы для производительности
defectSchema.index({ status: 1 });
defectSchema.index({ severity: 1 });
defectSchema.index({ priority: 1 });
defectSchema.index({ project: 1 });
defectSchema.index({ assignee: 1 });
defectSchema.index({ reporter: 1 });
defectSchema.index({ category: 1 });
defectSchema.index({ dueDate: 1 });
defectSchema.index({ title: 'text', description: 'text' });

// Виртуальные поля
defectSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && !['resolved', 'closed'].includes(this.status);
});

defectSchema.virtual('daysSinceReported').get(function() {
  return Math.ceil((new Date() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Настройки JSON
defectSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Defect', defectSchema);