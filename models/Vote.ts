import mongoose, { Schema, models } from 'mongoose';

export interface IVote {
  _id: string;
  user: mongoose.Types.ObjectId;
  question?: mongoose.Types.ObjectId;
  answer?: mongoose.Types.ObjectId;
  type: 'upvote' | 'downvote';
  createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  type: { type: String, enum: ['upvote', 'downvote'], required: true }
}, {
  timestamps: true
});

const Vote = models.Vote || mongoose.model<IVote>('Vote', VoteSchema);

export default Vote;