import { Button } from '@workspace/ui/components/button';
import { authRequire } from '@/services/auth/lib/auth-utils';
export default async function Page() {
  await authRequire();

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World</h1>
        <Button size="sm">Button</Button>
      </div>
    </div>
  );
}
