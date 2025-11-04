import { Metadata } from 'next';
import { LoginForm } from '@/components/auth/login-form';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Login - All in one calculator',
  description: 'Login to access your smart calculator.',
};

export default function LoginPage() {
  return (
    <div className="container relative min-h-dvh flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div
          className="absolute inset-0 bg-primary"
        />
        <div className="relative z-20 flex items-center text-lg font-medium text-primary-foreground">
          <Lightbulb className="mr-2 h-6 w-6" />
          All in one calculator
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg text-primary-foreground">
              &ldquo;The smart calculator that remembers your every move. Syncs across devices, powered by Firebase.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to All in one calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in or create an account to continue
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
