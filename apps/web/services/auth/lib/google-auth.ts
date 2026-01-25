import { BASE_URL } from '@/config/enviroment.config';
import { authClient } from '@/lib/auth-client';

const googleAuth = async () => {
  try {
    const response = await authClient.signIn.social({
      provider: 'google',
      callbackURL: BASE_URL,
    });
    return response;
  } catch (error) {
    console.error('Google authentication failed:', error);
    throw new Error('Google authentication failed');
  }
};

export { googleAuth };
