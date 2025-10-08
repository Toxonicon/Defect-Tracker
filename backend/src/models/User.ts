import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IRefreshToken {
  token: string;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'manager' | 'engineer' | 'viewer';
  isActive: boolean;
  avatar?: string;
  refreshTokens: IRefreshToken[];
  lastLogin?: Date;
  projects: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
  toJSON(): any;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d'
  }
});

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
    enum: ['manager', 'engineer', 'viewer'],
    default: 'engineer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: String,
  refreshTokens: [refreshTokenSchema],
  lastLogin: Date,
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.refreshTokens;
  return user;
};

export const User = mongoose.model<IUser>('User', userSchema);
