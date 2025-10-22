"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { handleOAuthCallback } from '@/service/authApi';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const role = searchParams.get('role');

        if (error) {
          toast.error(`Authentication failed: ${error}`);
          router.push('/login');
          return;
        }

        if (success === 'true') {
          // Handle OAuth callback data
          const result = handleOAuthCallback();

          if (result.success) {
            const { user: userData } = result;
            toast.success('Login successful!');

            // Redirect based on role
            if (userData.role === 'artist') {
              router.push('/artist/dashboard');
            } else if (userData.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/');
            }
          } else {
            console.error('OAuth callback failed:', result.error);
            toast.error(`Authentication failed: ${result.error}`);
            router.push('/login');
          }
        } else {
          toast.error('Authentication failed');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast.error('Authentication error');
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Completing your login...
          </h2>
          <p className="text-gray-600">
            Please wait while we set up your account.
          </p>
        </div>
      </div>
    );
  }

  return null;
}