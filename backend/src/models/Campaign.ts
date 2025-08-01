import mongoose, { Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const campaignSchema = new mongoose.Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true, min: 1 },
  raisedAmount: { type: Number, default: 0, min: 0 },
  imageUrl: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
export default Campaign;