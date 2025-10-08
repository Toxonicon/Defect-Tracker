import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['engineer', 'manager', 'supervisor'], 
    required: true 
  },
  position: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Индексы для производительности
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Виртуальное поле для полного имени
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Настройки JSON
userSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model('User', userSchema);