import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['intern', 'admin'],
    default: 'intern'
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Add method to interface
userSchema.methods.comparePassword = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Update model export
const User = mongoose.model<IUser>('User', userSchema);
export default User;