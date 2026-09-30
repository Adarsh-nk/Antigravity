import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useToast } from '../../context/ToastProvider.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { Send } from 'lucide-react';

const forgotSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
});

export function ForgotPasswordForm() {
  const { resetPasswordForEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await resetPasswordForEmail(data.email);
      setIsSent(true);
      showSuccess('Password reset link sent to your email!');
    } catch (err) {
      showError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="text-center space-y-3 py-4">
        <p className="text-sm text-slate-700 font-medium">
          Check your email inbox for instructions to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="Email Address" htmlFor="email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          placeholder="farmer@example.com"
          hasError={!!errors.email}
          {...register('email')}
        />
      </FormField>

      <Button type="submit" variant="primary" icon={Send} isLoading={isLoading} className="w-full">
        Send Reset Link
      </Button>
    </form>
  );
}
