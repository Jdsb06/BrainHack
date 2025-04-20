"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signUpWithEmail, signInWithGoogle, signInWithGithub } from '@/lib/firebase';

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signUpWithEmail(email, password);
      // In a real app, you might want to store the user's name in a database or user profile
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGithub();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join BrainHack to manage distractions and achieve your goals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleEmailSignup} className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center mb-4">Or sign up with</p>
            <div className="flex flex-col space-y-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                Sign up with Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGithubSignup}
                disabled={loading}
              >
                Sign up with GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignupPage;
