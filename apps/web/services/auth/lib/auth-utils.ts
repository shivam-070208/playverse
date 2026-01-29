import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const getSession = async () => {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  return session;
};
const authRequire = async () => {
  let session;
  try {
    session = await getSession();
  } catch (error) {
    console.error('Failed to get session:', error);
    redirect('/login');
  }
  if (!session?.data?.user) {
    redirect('/login');
  }
};

export { authRequire, getSession };
