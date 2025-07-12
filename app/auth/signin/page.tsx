'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: ''
  });

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        name: formData.name,
        redirect: false
      });

      if (result?.ok) {
        router.push('/');
      } else {
        console.error('Sign in failed');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to StackIt</CardTitle>
          <CardDescription>
            Sign in to ask questions, post answers, and join the community
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-4 w-4 mr-2"><path fill="#4285F4" d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.93-6.93C36.45 2.34 30.59 0 24 0 14.61 0 6.27 5.7 1.98 14.02l8.06 6.27C12.41 13.16 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.43-4.75H24v9.02h12.44c-.54 2.92-2.18 5.39-4.64 7.06l7.18 5.59C43.73 37.41 46.1 31.44 46.1 24.5z"/><path fill="#FBBC05" d="M10.04 28.29c-.6-1.77-.94-3.65-.94-5.79s.34-4.02.94-5.79l-8.06-6.27C.34 13.98 0 18.09 0 24c0 5.91.34 10.02 1.98 14.02l8.06-6.27z"/><path fill="#EA4335" d="M24 48c6.59 0 12.13-2.18 16.18-5.95l-7.18-5.59c-2.01 1.35-4.59 2.15-7.5 2.15-6.26 0-11.59-3.66-14.02-8.79l-8.06 6.27C6.27 42.3 14.61 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Continue with Google
          </Button>
             
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In / Sign Up'}
            </Button>
            {/* Error message display */}
            {/* Add error state and display if sign-in fails */}
            {/* ...existing code... */}
          </form>

          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to questions
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}