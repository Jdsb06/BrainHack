"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { signInWithEmail, signInWithGoogle, signInWithGithub } from '@/lib/firebase';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGithub();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login with GitHub');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

      <Card>
        <CardHeader>
          <CardTitle>Login to BrainHack</CardTitle>
          <CardDescription>
            Welcome back! Please enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleEmailLogin} className="flex flex-col space-y-4">
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
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6">
            <p className="text-center mb-4">Or login with</p>
            <div className="flex flex-col space-y-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                Login with Google
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGithubLogin}
                disabled={loading}
              >
                Login with GitHub
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="mt-4 text-center">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default LoginPage;
