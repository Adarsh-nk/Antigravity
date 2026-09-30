import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAdvisory,
  getAdvisories,
  getAdvisory,
  deleteAdvisory,
  submitAdvisoryFeedback,
} from '../api/advisories.js';
import { useToast } from '../context/ToastProvider.jsx';

export function useAdvisories(params = {}) {
  return useQuery({
    queryKey: ['advisories', params],
    queryFn: () => getAdvisories(params),
  });
}

export function useAdvisory(id) {
  return useQuery({
    queryKey: ['advisories', id],
    queryFn: () => getAdvisory(id),
    enabled: !!id,
  });
}

export function useCreateAdvisory() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ payload, imageFile }) => createAdvisory(payload, imageFile),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSuccess('Advisory generated successfully!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to generate advisory. Please try again.');
    },
  });
}

export function useDeleteAdvisory() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: deleteAdvisory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      showSuccess('Advisory deleted.');
    },
    onError: (err) => {
      showError(err.message || 'Failed to delete advisory.');
    },
  });
}

export function useAdvisoryFeedback(advisoryId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ rating, comment }) => submitAdvisoryFeedback(advisoryId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories', advisoryId] });
      showSuccess('Thank you for your feedback!');
    },
    onError: (err) => {
      showError(err.message || 'Failed to submit feedback.');
    },
  });
}
