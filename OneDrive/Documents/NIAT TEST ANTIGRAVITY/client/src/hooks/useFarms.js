import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFarms, getFarm, createFarm, updateFarm, deleteFarm } from '../api/farms.js';
import { useToast } from '../context/ToastProvider.jsx';

export function useFarms() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const farmsQuery = useQuery({
    queryKey: ['farms'],
    queryFn: getFarms,
  });

  const createMutation = useMutation({
    mutationFn: createFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSuccess('Farm added successfully!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to create farm.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateFarm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      showSuccess('Farm updated successfully!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to update farm.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSuccess('Farm deleted successfully!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to delete farm.');
    },
  });

  return {
    farms: farmsQuery.data || [],
    isLoading: farmsQuery.isLoading,
    isError: farmsQuery.isError,
    error: farmsQuery.error,
    createFarm: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateFarm: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteFarm: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useFarm(id) {
  return useQuery({
    queryKey: ['farms', id],
    queryFn: () => getFarm(id),
    enabled: !!id,
  });
}
