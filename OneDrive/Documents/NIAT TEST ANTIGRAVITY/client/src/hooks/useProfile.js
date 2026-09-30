import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, deleteAccount } from '../api/profile.js';
import { useToast } from '../context/ToastProvider.jsx';

export function useProfile() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
      showSuccess('Profile updated successfully!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to update profile.');
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      showSuccess('Your account and data have been deleted.');
    },
    onError: (err) => {
      showError(err.message || 'Failed to delete account.');
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAccount: deleteAccountMutation.mutateAsync,
    isDeletingAccount: deleteAccountMutation.isPending,
  };
}
