'use client';

import { useAuth } from '@/context/AuthContext';
import { QuestionForm } from '@/components/question-form';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AskPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign in required</h1>
        <p className="text-gray-600 mb-6">
          You need to be signed in to ask a question.
        </p>
        <div className="space-x-4">
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button variant="outline" asChild>
            <Link href="/">Browse Questions</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user.role === 'guest') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Restricted</h1>
        <p className="text-gray-600 mb-6">
          Guest users can only view questions and answers. Please contact an administrator to upgrade your account.
        </p>
        <Button variant="outline" asChild>
          <Link href="/">Browse Questions</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Questions
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        <p className="text-gray-600 mt-2">
          Get help from the community by asking a clear, detailed question.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <QuestionForm />
      </div>
    </div>
  );
}