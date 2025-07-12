'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { VoteButtons } from './ui/vote-buttons';
import { Question } from '@/types';
import { Eye, MessageSquare } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <VoteButtons 
            questionId={question.id} 
            voteScore={question.voteScore}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Link 
              href={`/questions/${question.id}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {question.title}
            </Link>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{question.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{question.answers.length}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 line-clamp-3">
            {question.description.replace(/<[^>]*>/g, '').substring(0, 200)}...
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
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
  );
}