import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

// Define interface for User document
// Problem: _id should be Types.ObjectId, not string
export interface IUser extends Document {
  _id: Types.ObjectId;  // Changed from string
  name: string;
  email: string;
  password: string;
  role: string;
  avatarUrl?: string;  // Made optional with ?
  skills?: string[];   // Changed from [string] to string[] and made optional
  contributions: number;
  savedCampaigns: Types.ObjectId[];
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  lastSeen?: Date;     // Made optional with ?
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['intern', 'admin'], default: 'intern' },
  avatarUrl: { type: String },  // Removed required since it's optional in interface
  skills: { type: [String], default: [] },  // Added default empty array
  contributions: { type: Number, default: 0 },
  savedCampaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastSeen: { type: Date },  // Fixed typo (was 'lastSeen' in schema vs 'lastSeen' in interface)
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

// Add method to interface
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update model export
const User = mongoose.model<IUser>('User', userSchema);
export default User;