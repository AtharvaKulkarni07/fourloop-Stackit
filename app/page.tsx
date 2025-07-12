'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestionCard } from '@/components/question-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Question } from '@/types';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';

const popularTags = ['javascript', 'react', 'node.js', 'python', 'typescript', 'next.js'];

export default function Home() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams?.get('tag') || '');

  useEffect(() => {
    fetchQuestions();
  }, [searchParams]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      if (selectedTag) params.set('tag', selectedTag);
      
      const response = await fetch(`/api/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTag) params.set('tag', selectedTag);
    window.history.pushState({}, '', `/?${params}`);
    fetchQuestions();
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (tag !== selectedTag) params.set('tag', tag);
    window.history.pushState({}, '', `/?${params}`);
    fetchQuestions();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Questions</h1>
          <p className="text-gray-600 mt-1">
            {questions.length} questions found
          </p>
        </div>
        <Button asChild>
          <Link href="/ask">Ask Question</Link>
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter by tags:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "secondary"}
              className="cursor-pointer hover:bg-blue-100"
              onClick={() => handleTagFilter(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedTag 
                ? 'Try adjusting your search terms or filters.' 
                : 'Be the first to ask a question!'
              }
            </p>
            <Button asChild>
              <Link href="/ask">Ask the first question</Link>
            </Button>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>
    </div>
  );
}