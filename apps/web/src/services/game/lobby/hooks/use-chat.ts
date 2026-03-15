import { axiosInstance } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { ChatMessage } from '@/services/game/types/messages';
export const useChatMessage = (receiverId: string) => {
  return useQuery({
    queryKey: ['chatmessages', receiverId],
    enabled: Boolean(receiverId),
    queryFn: async () => {
      const response = await axiosInstance.get<{ messages: ChatMessage[] }>(
        `/chat/${receiverId}/messages`,
      );
      return response.data.messages;
    },
  });
};
