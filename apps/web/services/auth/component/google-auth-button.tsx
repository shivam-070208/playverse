'use client';
import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { FcGoogle } from 'react-icons/fc';
import { googleAuth } from '../lib/google-auth';
import { toast } from 'sonner';

export const GoogleAuthButton = ({ disabled = false }: { disabled?: boolean }) => {
  const [loading, setLoading] = useState(false);
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await googleAuth();
    } catch (err: unknown) {
      let message = 'An unknown error occurred';
      if (err && typeof err === 'object' && 'message' in err) {
        message = err.message as string;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      disabled={loading || disabled}
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="w-5 h-5" />
      Continue With Google
    </Button>
  );
};
