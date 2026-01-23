'use client';
import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { FcGoogle } from 'react-icons/fc';

export const GoogleAuthButton = ({
  children = 'Sign in with Google',
  callbackUrl = '/',
}: {
  children?: React.ReactNode;
  callbackUrl?: string;
}) => {
  const handleGoogleLogin = () => {
    // Redirect to API route or OAuth endpoint
    window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full flex items-center gap-2"
      onClick={handleGoogleLogin}
    >
      <FcGoogle className="w-5 h-5" />
      {children}
    </Button>
  );
};
