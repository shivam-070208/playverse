import { auth } from '@workspace/auth';
import { redirect } from 'next/navigation';

const getServerSession = async () => {
  try {
    const session = await auth.api.getSession();
    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const authRequire = async () => {
  try {
    const session = await getServerSession();
    if (!session) redirect('/login');
  } catch (error) {
    redirect('/login');
    console.error(error);
  }
};
export { authRequire, getServerSession };
