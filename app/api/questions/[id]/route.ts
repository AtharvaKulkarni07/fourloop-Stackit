import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import Answer from '@/models/Answer';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const question = await Question.findById(params.id)
      .populate('author', 'name email image reputation')
      .lean();
    
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    const answers = await Answer.find({ question: params.id, isApproved: true })
      .populate('author', 'name email image reputation')
      .sort({ isAccepted: -1, voteScore: -1, createdAt: 1 })
      .lean();
    
    // Increment view count
    await Question.findByIdAndUpdate(params.id, { $inc: { views: 1 } });
    
    return NextResponse.json({
      ...question,
      id: question._id.toString(),
      author: {
        ...question.author,
        id: question.author._id.toString()
      },
      answers: answers.map(a => ({
        ...a,
        id: a._id.toString(),
        author: {
          ...a.author,
          id: a.author._id.toString()
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    await dbConnect();
    
    const question = await Question.findById(params.id);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // Check if user is the author or admin
    if (question.author.toString() !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate('author', 'name email image reputation');
    
    return NextResponse.json({
      ...updatedQuestion.toObject(),
      id: updatedQuestion._id.toString(),
      author: {
        ...updatedQuestion.author,
        id: updatedQuestion.author._id.toString()
      }
    });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}