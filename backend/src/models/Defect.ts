import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IAttachment {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
  uploadedAt: Date;
}

export interface IEnvironment {
  os?: string;
  browser?: string;
  version?: string;
  device?: string;
}

export interface IDefect extends Document {
  title: string;
  description: string;
  defectNumber: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  severity: 'minor' | 'major' | 'critical' | 'blocker';
  status: 'NEW' | 'IN_PROGRESS' | 'REVIEW' | 'CLOSED' | 'CANCELLED';
  type: 'bug' | 'feature' | 'improvement' | 'task';
  project: mongoose.Types.ObjectId;
  phase: string;
  reporter: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  environment?: IEnvironment;
  stepsToReproduce: string[];
  expectedResult?: string;
  actualResult?: string;
  attachments: IAttachment[];
  tags: string[];
  watchers: mongoose.Types.ObjectId[];
  resolution?: string;
  closedAt?: Date;
  closedBy?: mongoose.Types.ObjectId;
}

const attachmentSchema = new Schema<IAttachment>({
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  path: String,
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now }
});

const environmentSchema = new Schema<IEnvironment>({
  os: String,
  browser: String,
  version: String,
  device: String
});

const defectSchema = new Schema<IDefect>({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  defectNumber: { type: String, unique: true },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  severity: {
    type: String,
    enum: ['minor', 'major', 'critical', 'blocker'],
    default: 'major'
  },
  status: {
    type: String,
    enum: ['NEW', 'IN_PROGRESS', 'REVIEW', 'CLOSED', 'CANCELLED'],
    default: 'NEW'
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'improvement', 'task'],
    default: 'bug'
  },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  phase: { type: String, required: true },
  reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  environment: environmentSchema,
  stepsToReproduce: [String],
  expectedResult: String,
  actualResult: String,
  attachments: [attachmentSchema],
  tags: [String],
  watchers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  resolution: String,
  closedAt: Date,
  closedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

defectSchema.plugin(mongoosePaginate);

defectSchema.pre('save', async function(next) {
  if (this.isNew) {
    const project = await mongoose.model('Project').findById(this.project);
    const count = await this.constructor.countDocuments({ project: this.project });
    this.defectNumber = `${(project as any).code}-${(count + 1).toString().padStart(4, '0')}`;
  }
  
  if (this.isModified('status') && this.status === 'CLOSED' && !this.closedAt) {
    this.closedAt = new Date();
  }
  
  next();
});

defectSchema.index({ 
  title: 'text', 
  description: 'text', 
  defectNumber: 'text',
  tags: 'text'
});

export const Defect = mongoose.model<IDefect>('Defect', defectSchema);
