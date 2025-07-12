import mongoose, { Schema, models } from 'mongoose';

export interface IAnswer {
  _id: string;
  content: string;
  author: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  votes: mongoose.Types.ObjectId[];
  voteScore: number;
  isAccepted: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema = new Schema<IAnswer>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  voteScore: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Answer = models.Answer || mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;