import { BASE_URL } from '@/config/enviroment.config';
import { authClient } from '@/lib/auth-client';

const googleAuth = async () => {
  try {
    const { data, error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: BASE_URL,
    });
    if (error) throw new Error(error.message);
    console.log(error);
    return data;
  } catch (error) {
    console.error('Google authentication failed:', error);
    throw new Error('Google authentication failed');
  }
};

export { googleAuth };
