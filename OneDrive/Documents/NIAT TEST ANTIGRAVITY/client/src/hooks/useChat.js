import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdvisoryMessages, sendAdvisoryChatMessage } from '../api/advisories.js';
import { useToast } from '../context/ToastProvider.jsx';

export function useChat(advisoryId) {
  const queryClient = useQueryClient();
  const { showError } = useToast();

  const messagesQuery = useQuery({
    queryKey: ['advisory-messages', advisoryId],
    queryFn: () => getAdvisoryMessages(advisoryId),
    enabled: !!advisoryId,
  });

  const sendMutation = useMutation({
    mutationFn: (message) => sendAdvisoryChatMessage(advisoryId, message),
    onMutate: async (newMessageText) => {
      await queryClient.cancelQueries({ queryKey: ['advisory-messages', advisoryId] });
      const previousMessages = queryClient.getQueryData(['advisory-messages', advisoryId]) || [];

      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: newMessageText,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(['advisory-messages', advisoryId], [...previousMessages, tempUserMsg]);

      return { previousMessages };
    },
    onError: (err, _newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['advisory-messages', advisoryId], context.previousMessages);
      }
      showError(err.message || 'Failed to send message.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisory-messages', advisoryId] });
    },
  });

  return {
    messages: messagesQuery.data || [],
    isLoading: messagesQuery.isLoading,
    sendMessage: sendMutation.mutateAsync,
    isSending: sendMutation.isPending,
  };
}
