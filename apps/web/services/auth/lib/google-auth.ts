import { authClient } from '@/lib/auth-client';

const googleAuth = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: 'google',
    });
    return response;
  } catch (error) {
    console.error('Google authentication failed:', error);
    throw error;
  }
};

export { googleAuth };
