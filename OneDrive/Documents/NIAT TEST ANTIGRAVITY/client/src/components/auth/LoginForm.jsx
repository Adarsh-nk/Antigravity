import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useToast } from '../../context/ToastProvider.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function LoginForm() {
  const { signIn } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await signIn(data);
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email Address" htmlFor="email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="farmer@example.com"
          autoComplete="email"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <div className="flex justify-end text-xs">
        <Link to="/forgot-password" className="text-emerald-700 font-semibold hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" variant="primary" icon={LogIn} isLoading={isLoading} className="w-full">
        Log In
      </Button>
    </form>
  );
}
