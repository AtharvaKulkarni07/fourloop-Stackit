import mongoose, { Schema, models } from 'mongoose';

export interface IQuestion {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: mongoose.Types.ObjectId;
  votes: mongoose.Types.ObjectId[];
  voteScore: number;
  answers: mongoose.Types.ObjectId[];
  views: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true, maxlength: 150 },
  description: { type: String, required: true },
  tags: [{ type: String, maxlength: 5 }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  voteScore: { type: Number, default: 0 },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  views: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Question = models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;