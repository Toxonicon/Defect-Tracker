import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'], 
    default: 'planning' 
  },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  engineers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  supervisors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  budget: {
    type: Number,
    min: 0
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Индексы
projectSchema.index({ status: 1 });
projectSchema.index({ manager: 1 });
projectSchema.index({ priority: 1 });
projectSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Project', projectSchema);