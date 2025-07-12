import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Vote from '@/models/Vote';
import Question from '@/models/Question';
import Answer from '@/models/Answer';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { type, questionId, answerId } = await request.json();
    
    if (!type || (!questionId && !answerId)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check for existing vote
    const existingVote = await Vote.findOne({
      user: user._id,
      ...(questionId ? { question: questionId } : { answer: answerId })
    });
    
    let voteScore = 0;
    
    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if same type
        await Vote.findByIdAndDelete(existingVote._id);
        voteScore = type === 'upvote' ? -1 : 1;
      } else {
        // Change vote type
        existingVote.type = type;
        await existingVote.save();
        voteScore = type === 'upvote' ? 2 : -2;
      }
    } else {
      // Create new vote
      await Vote.create({
        user: user._id,
        type,
        ...(questionId ? { question: questionId } : { answer: answerId })
      });
      voteScore = type === 'upvote' ? 1 : -1;
    }
    
    // Update vote score
    if (questionId) {
      await Question.findByIdAndUpdate(questionId, {
        $inc: { voteScore }
      });
    } else {
      await Answer.findByIdAndUpdate(answerId, {
        $inc: { voteScore }
      });
    }
    
    return NextResponse.json({ success: true, voteScore });
  } catch (error) {
    console.error('Error handling vote:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}