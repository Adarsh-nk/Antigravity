import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useToast } from '../../context/ToastProvider.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { UserPlus, ShieldAlert } from 'lucide-react';

const signupSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.enum(['en', 'hi', 'mr']).default('en'),
});

export function SignupForm() {
  const { signUp } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { preferredLanguage: 'en' },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await signUp(data);
      showSuccess('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Full Name" htmlFor="fullName" required error={errors.fullName?.message}>
        <Input
          id="fullName"
          placeholder="Ramesh Patel"
          hasError={!!errors.fullName}
          {...register('fullName')}
        />
      </FormField>

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
          autoComplete="new-password"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <FormField label="Preferred AI Output Language" htmlFor="preferredLanguage" required error={errors.preferredLanguage?.message}>
        <Select id="preferredLanguage" hasError={!!errors.preferredLanguage} {...register('preferredLanguage')}>
          <option value="en">English</option>
          <option value="hi">Hindi (हिन्दी)</option>
          <option value="mr">Marathi (मराठी)</option>
        </Select>
      </FormField>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          <strong>Privacy Note:</strong> Your farm details and optional crop photos are processed by Google Gemini AI solely to generate personalized agricultural advice. Your data is strictly private to your account.
        </span>
      </div>

      <Button type="submit" variant="primary" icon={UserPlus} isLoading={isLoading} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
