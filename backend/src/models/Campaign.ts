import mongoose, { Document, Types } from 'mongoose';

export interface IDonor {
  user: Types.ObjectId | null | undefined;  // Allow null for anonymous donations
  amount: number;
  message: string;
  anonymous: boolean;
  date: Date;
}

export interface ICampaign extends Document {
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  category: string;  // Changed from String to string
  status: string;
  imageUrl?: string;
  public_id: string,
  creator: Types.ObjectId;
  donors: IDonor[];
  likes: Types.ObjectId[];
  saves: Types.ObjectId[];
  endDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

declare module 'express' {
  interface Request {
    file?: Express.Multer.File & { 
      path: string; 
      filename: string; 
    };
    campaign?: ICampaign;
  }
}

const donorSchema = new mongoose.Schema<IDonor>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: { type: Number, required: true },
  message: { type: String, default: '' },
  anonymous: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const campaignSchema = new mongoose.Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  category: { type: String, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed'],
    default: 'draft'
  },
  imageUrl: String,
  public_id: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donors: [donorSchema],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  isActive: { type: Boolean, default: true },
  endDate: Date
}, {
  timestamps: true
});

const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
export default Campaign;