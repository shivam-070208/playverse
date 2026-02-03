import { axiosInstance } from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useFriends = (searchQuery?: string) =>
  useQuery({
    queryKey: ['friends', searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/get-all', {
        params: searchQuery ? { searchQuery } : undefined,
      });
      return response.data;
    },
  });

export const useReceivedFriendRequests = (searchQuery?: string) =>
  useQuery({
    queryKey: ['received-friend-requests', searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/received-requests', {
        params: searchQuery ? { searchQuery } : undefined,
      });
      return response.data;
    },
  });

export const useSentFriendRequests = (searchQuery?: string) =>
  useQuery({
    queryKey: ['sent-friend-requests', searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/get-sent-requests', {
        params: searchQuery ? { searchQuery } : undefined,
      });
      return response.data;
    },
  });

export const useAvailableUsers = ({
  searchQuery,
  page = 1,
  limit = 10,
}: { searchQuery?: string; page?: number; limit?: number } = {}) =>
  useQuery({
    queryKey: ['available-users', searchQuery, page, limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/available-users', {
        params: {
          ...(searchQuery ? { searchQuery } : {}),
          page,
          limit,
        },
      });
      return response.data;
    },
  });

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(`/friends/send-request/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-users'] });
      queryClient.invalidateQueries({ queryKey: ['sent-friend-requests'] });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axiosInstance.post(`/friends/accept-request/${requestId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['received-friend-requests'] });
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axiosInstance.post(`/friends/reject-request/${requestId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['received-friend-requests'] });
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (friendId: string) => {
      const response = await axiosInstance.delete(`/friends/remove/${friendId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
};
