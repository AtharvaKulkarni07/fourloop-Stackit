import mongoose, { Schema, models } from 'mongoose';

export interface INotification {
  _id: string;
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  type: 'answer' | 'comment' | 'vote' | 'accepted';
  question: mongoose.Types.ObjectId;
  answer?: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['answer', 'comment', 'vote', 'accepted'], required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false }
}, {
  timestamps: true
});

const Notification = models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;