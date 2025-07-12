'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { VoteButtons } from '@/components/ui/vote-buttons';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useAuth } from '@/context/AuthContext';
import { Question, Answer } from '@/types';
import { Eye, MessageSquare, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createAnswerSchema, CreateAnswerInput } from '@/lib/validations/question';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

export default function QuestionPage() {
  const params = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<CreateAnswerInput>({
    resolver: zodResolver(createAnswerSchema)
  });

  useEffect(() => {
    if (params?.id) {
      fetchQuestion();
    }
  }, [params?.id]);

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`/api/questions/${params?.id}`);
      if (response.ok) {
        const data = await response.json();
        setQuestion(data);
        setAnswers(data.answers || []);
      }
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAnswer = async (data: CreateAnswerInput) => {
    if (!user) {
      toast.error('Please sign in to answer');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/questions/${params?.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: answerContent })
      });

      if (!response.ok) throw new Error('Failed to submit answer');

      const newAnswer = await response.json();
      setAnswers([...answers, newAnswer]);
      setAnswerContent('');
      reset();
      toast.success('Answer submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
        <Button asChild>
          <Link href="/">Browse Questions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Questions
        </Link>
      </Button>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <VoteButtons 
              questionId={question.id} 
              voteScore={question.voteScore}
              onVoteChange={(newScore) => 
                setQuestion({ ...question, voteScore: newScore })
              }
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{question.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{answers.length}</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {question.description}
              </ReactMarkdown>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.image} />
                  <AvatarFallback>
                    {question.author.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{question.author.name}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
        
        {answers.map((answer) => (
          <div key={answer.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <VoteButtons 
                  answerId={answer.id} 
                  voteScore={answer.voteScore}
                />
              </div>
              
              <div className="flex-1">
                {answer.isAccepted && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Accepted Answer</span>
                  </div>
                )}
                
                <div className="prose max-w-none mb-4">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={tomorrow}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {answer.content}
                  </ReactMarkdown>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {user?.id === question.author.id && !answer.isAccepted && (
                      <Button size="sm" variant="outline">
                        <Check className="h-4 w-4 mr-2" />
                        Accept Answer
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={answer.author.image} />
                      <AvatarFallback>
                        {answer.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{answer.author.name}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        
        {user ? (
          user.role === 'guest' ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Guest users can only view content. Contact an administrator to upgrade your account.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitAnswer)} className="space-y-4">
              <div>
                <RichTextEditor
                  content={answerContent}
                  onChange={(content) => {
                    setAnswerContent(content);
                    setValue('content', content);
                  }}
                  placeholder="Write your answer here..."
                />
                {errors.content && (
                  <p className="text-red-600 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>
              
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Post Your Answer'}
              </Button>
            </form>
          )
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              You need to be signed in to post an answer.
            </p>
            <Button onClick={() => signIn()}>Sign In</Button>
          </div>
        )}
      </div>
    </div>
  );
}