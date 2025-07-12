import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Question from '@/models/Question';
import User from '@/models/User';
import { createQuestionSchema } from '@/lib/validations/question';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    
    const skip = (page - 1) * limit;
    
    let query: any = { isApproved: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    const questions = await Question.find(query)
      .populate('author', 'name email image reputation')
      .populate('answers')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Question.countDocuments(query);
    
    return NextResponse.json({
      questions: questions.map(q => ({
        ...q,
        id: q._id.toString(),
        author: {
          ...q.author,
          id: q.author._id.toString()
        }
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validation = createQuestionSchema.safeParse(body);
    
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
    
    const question = await Question.create({
      ...validation.data,
      author: user._id
    });
    
    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'name email image reputation')
      .lean();
    
    return NextResponse.json({
      ...populatedQuestion,
      id: populatedQuestion._id.toString(),
      author: {
        ...populatedQuestion.author,
        id: populatedQuestion.author._id.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}