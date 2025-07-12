'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from './button';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface VoteButtonsProps {
  questionId?: string;
  answerId?: string;
  voteScore: number;
  onVoteChange?: (newScore: number) => void;
}

export function VoteButtons({ questionId, answerId, voteScore, onVoteChange }: VoteButtonsProps) {
  const { user } = useAuth();
  const [currentScore, setCurrentScore] = useState(voteScore);
  const [loading, setLoading] = useState(false);

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    if (user.role === 'guest') {
      toast.error('Guests cannot vote');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          questionId,
          answerId
        })
      });

      if (!response.ok) throw new Error('Failed to vote');

      const data = await response.json();
      const newScore = currentScore + data.voteScore;
      setCurrentScore(newScore);
      onVoteChange?.(newScore);
      
      toast.success(`${type === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully`);
    } catch (error) {
      toast.error('Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('upvote')}
        disabled={loading}
        className="p-1 h-8 w-8 hover:bg-green-100 hover:text-green-600"
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <span className={`text-lg font-semibold ${
        currentScore > 0 ? 'text-green-600' : 
        currentScore < 0 ? 'text-red-600' : 
        'text-gray-600'
      }`}>
        {currentScore}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote('downvote')}
        disabled={loading}
        className="p-1 h-8 w-8 hover:bg-red-100 hover:text-red-600"
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
}