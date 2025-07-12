import mongoose, { Schema, models } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: 'guest' | 'user' | 'admin';
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ['guest', 'user', 'admin'], default: 'user' },
  reputation: { type: Number, default: 0 }
}, {
  timestamps: true
});

const User = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;