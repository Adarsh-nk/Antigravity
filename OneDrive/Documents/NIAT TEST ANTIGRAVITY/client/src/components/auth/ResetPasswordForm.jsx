import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider.jsx';
import { useToast } from '../../context/ToastProvider.jsx';
import { FormField } from '../ui/FormField.jsx';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import { KeyRound } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export function ResetPasswordForm() {
  const { updatePassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await updatePassword(data.password);
      showSuccess('Password updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Failed to update password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label="New Password" htmlFor="password" required error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          hasError={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <FormField label="Confirm New Password" htmlFor="confirmPassword" required error={errors.confirmPassword?.message}>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          hasError={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FormField>

      <Button type="submit" variant="primary" icon={KeyRound} isLoading={isLoading} className="w-full">
        Set New Password
      </Button>
    </form>
  );
}
