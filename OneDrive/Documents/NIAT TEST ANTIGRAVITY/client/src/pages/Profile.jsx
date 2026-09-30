import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema } from '../validators/profile.js';
import { useProfile } from '../hooks/useProfile.js';
import { useAuth } from '../context/AuthProvider.jsx';
import { useToast } from '../context/ToastProvider.jsx';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { FormField } from '../components/ui/FormField.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { LANGUAGES, INDIAN_STATES } from '../config/domain.js';
import { User, KeyRound, Trash2, Save } from 'lucide-react';
import { useT } from '../i18n/useT.js';

export function Profile() {
  const { profile, isLoading, updateProfile, isUpdating, deleteAccount, isDeletingAccount } = useProfile();
  const { updatePassword, signOut } = useAuth();
  const { showSuccess, showError } = useToast();
  const { setLanguage } = useT();

  const [password, setPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileFormSchema),
    values: profile ? {
      full_name: profile.full_name || '',
      preferred_language: profile.preferred_language || 'en',
      state: profile.state || 'Maharashtra',
      district: profile.district || '',
      village_or_town: profile.village_or_town || '',
      primary_crops: profile.primary_crops || [],
    } : undefined,
  });

  const handleProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      if (data.preferred_language) {
        setLanguage(data.preferred_language);
      }
    } catch {
      // Handled by hook error toast
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }
    try {
      setIsChangingPass(true);
      await updatePassword(password);
      setPassword('');
      showSuccess('Password updated successfully!');
    } catch (err) {
      showError(err.message || 'Failed to update password');
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      await signOut();
    } catch {
      // Handled by hook error toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" className="text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PageHeader title="Farmer Profile & Settings" description="Manage your personal preferences, preferred language, and account security." />

      {/* Edit Profile Form */}
      <Card className="space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Personal & Field Location Details</h2>
        </div>

        <form onSubmit={handleSubmit(handleProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Full Name" htmlFor="full_name" required error={errors.full_name?.message}>
              <Input id="full_name" hasError={!!errors.full_name} {...register('full_name')} />
            </FormField>

            <FormField label="Preferred Output Language" htmlFor="preferred_language" required error={errors.preferred_language?.message}>
              <Select id="preferred_language" hasError={!!errors.preferred_language} {...register('preferred_language')}>
                <option value="en">English</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </Select>
            </FormField>

            <FormField label="State" htmlFor="state" error={errors.state?.message}>
              <Select id="state" {...register('state')}>
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="District" htmlFor="district" error={errors.district?.message}>
              <Input id="district" placeholder="e.g. Nashik" {...register('district')} />
            </FormField>

            <FormField label="Village / Town" htmlFor="village_or_town" error={errors.village_or_town?.message} className="sm:col-span-2">
              <Input id="village_or_town" placeholder="e.g. Dindori" {...register('village_or_town')} />
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" icon={Save} isLoading={isUpdating}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Card */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <KeyRound className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <FormField label="New Password">
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormField>
          <Button type="submit" variant="outline" isLoading={isChangingPass} disabled={!password}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-200 bg-rose-50/40 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-rose-200">
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
            <Trash2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-rose-950">Danger Zone</h2>
        </div>
        <p className="text-xs text-rose-900">
          Deleting your account will permanently remove your profile, registered farms, saved crop advisories, uploaded photos, and chat history.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          icon={Trash2}
        >
          Delete Account & All Data
        </Button>
      </Card>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account & Data"
        message="Are you completely sure? This will delete your user account, registered farms, saved advisories, and all storage images permanently."
        confirmText="Permanently Delete My Account"
        isLoading={isDeletingAccount}
      />
    </div>
  );
}
