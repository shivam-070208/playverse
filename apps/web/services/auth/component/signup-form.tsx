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
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await authClient.signUp.email({
        email: values.email,
        name: values.name,
        password: values.password,
      });
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error) {
      toast.error('Something went wrong, please try again later.');
    }
  };

  return (
    <Container className="min-h-dvh flex items-center">
      <Card className="w-full max-w-md mx-auto h-fit">
        <CardHeader className="text-center">
          <Image src="/logo.png" width={100} height={100} alt="logo" className="mx-auto" priority />
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <GradientSeparator />
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" placeholder="Your name" autoComplete="name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      placeholder="Create a password"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">
                  have an account?{' '}
                  <Link href="/login" className="text-primary hover:underline">
                    Login
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

export { SignupForm };
