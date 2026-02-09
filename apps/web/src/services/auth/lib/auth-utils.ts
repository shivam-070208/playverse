import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const getSession = async () => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    return session;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const authRequire = async () => {
  const session = await getSession();
  if (!session?.data?.user) {
    redirect('/login');
  }
};

export { authRequire, getSession };
