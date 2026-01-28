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
  try {
    const session = await getSession();
    if (!(session && session?.data?.user)) redirect('/login');
  } catch (error) {
    console.log(typeof error);
  }
};

export { authRequire, getSession };
