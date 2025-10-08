import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IPhase {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
}

export interface ITeamMember {
  user: mongoose.Types.ObjectId;
  role: 'lead' | 'developer' | 'tester' | 'analyst';
  joinedAt: Date;
}

export interface IProject extends Document {
  name: string;
  description: string;
  code: string;
  manager: mongoose.Types.ObjectId;
  team: ITeamMember[];
  phases: IPhase[];
  status: 'planning' | 'active' | 'completed' | 'cancelled' | 'on_hold';
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  client?: string;
  tags: string[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new Schema<IPhase>({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'on_hold'],
    default: 'planning'
  }
}, { timestamps: true });

const teamMemberSchema = new Schema<ITeamMember>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  role: {
    type: String,
    enum: ['lead', 'developer', 'tester', 'analyst'],
    default: 'developer'
  },
  joinedAt: { type: Date, default: Date.now }
});

const projectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: [teamMemberSchema],
  phases: [phaseSchema],
  status: {
    type: String,
    enum: ['planning', 'active', 'completed', 'cancelled', 'on_hold'],
    default: 'planning'
  },
  startDate: Date,
  endDate: Date,
  budget: Number,
  client: String,
  tags: [String],
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// Add pagination plugin
projectSchema.plugin(mongoosePaginate);

// Text search index
projectSchema.index({ name: 'text', description: 'text', code: 'text' });

// Compound indexes for better query performance
projectSchema.index({ manager: 1, status: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure code is uppercase
projectSchema.pre('save', function(next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

// Virtual for active team count
projectSchema.virtual('teamCount').get(function() {
  return this.team.length;
});

// Virtual for active phases count
projectSchema.virtual('activePhases').get(function() {
  return this.phases.filter(phase => phase.status === 'active').length;
});

export const Project = mongoose.model<IProject>('Project', projectSchema);