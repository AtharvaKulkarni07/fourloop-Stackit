import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Answer from '@/models/Answer';
import Question from '@/models/Question';
import User from '@/models/User';
import Notification from '@/models/Notification';
import { createAnswerSchema } from '@/lib/validations/question';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validation = createAnswerSchema.safeParse({
      ...body,
      questionId: params.id
    });
    
    if (!validation.success) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validation.error.issues 
      }, { status: 400 });
    }
    
    await dbConnect();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const question = await Question.findById(params.id).populate('author');
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    const answer = await Answer.create({
      content: validation.data.content,
      author: user._id,
      question: params.id
    });
    
    // Add answer to question
    await Question.findByIdAndUpdate(params.id, {
      $push: { answers: answer._id }
    });
    
    // Create notification for question author
    if (question.author._id.toString() !== user._id.toString()) {
      await Notification.create({
        recipient: question.author._id,
        sender: user._id,
        type: 'answer',
        question: params.id,
        answer: answer._id,
        message: `${user.name} answered your question: ${question.title}`
      });
    }
    
    const populatedAnswer = await Answer.findById(answer._id)
      .populate('author', 'name email image reputation')
      .lean();
    
    return NextResponse.json({
      ...populatedAnswer,
      id: populatedAnswer._id.toString(),
      author: {
        ...populatedAnswer.author,
        id: populatedAnswer.author._id.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating answer:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}