'use client';
import { Container } from '@/components/common/container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@workspace/ui/components/card';
import { Form, FormField, FormMessage, FormLabel, FormItem } from '@workspace/ui/components/form';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradientSeparator } from '@workspace/ui/components/separator';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { GoogleAuthButton } from './google-auth-button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await authClient.signIn.email({
        ...values,
        callbackURL: '/',
      });
      if (error) return toast.error(error?.message || 'internal server error');
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error) {
      console.log(error);
      toast.error('Something Went Wrong, Please Try again Later');
    }
  };

  return (
    <Container className="min-h-dvh flex items-center">
      <Card className="w-full max-w-md mx-auto h-fit">
        <CardHeader className="text-center">
          <Image src="/logo.png" width={100} height={100} alt="logo" className="mx-auto" priority />
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your gmail and password to login</CardDescription>
        </CardHeader>
        <GradientSeparator />
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="you@gmail.com"
                      autoComplete="email"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Your password"
                      autoComplete="current-password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
                Log In
              </Button>
              <GoogleAuthButton disabled={form.formState.isSubmitting} />
              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="text-primary hover:underline">
                    Sign Up
                  </Link>
                </span>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Container>
  );
};

export { LoginForm };
