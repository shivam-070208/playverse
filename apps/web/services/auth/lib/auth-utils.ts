import { headers } from 'next/headers';
import { auth } from '@workspace/auth';
import { redirect } from 'next/navigation';

export const authRequire = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    console.log(session);

    if (!session) redirect('/login');
  } catch (error) {
    console.log(error);
  }
};
