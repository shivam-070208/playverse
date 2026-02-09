import { axiosInstance } from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useFriends = (options?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: ['friends', options?.page, options?.limit],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends', {
        params: {
          ...(options?.page != null ? { page: options.page } : {}),
          ...(options?.limit != null ? { limit: options.limit } : {}),
        },
      });
      return response.data.Friends;
    },
  });

export const useReceivedFriendRequests = (searchQuery?: string) =>
  useQuery({
    queryKey: ['received-friend-requests', searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/requests/received', {
        params: searchQuery ? { searchQuery } : undefined,
      });
      return response.data.ReceivedRequests;
    },
  });

export const useSentFriendRequests = (searchQuery?: string) =>
  useQuery({
    queryKey: ['sent-friend-requests', searchQuery],
    queryFn: async () => {
      const response = await axiosInstance.get('/friends/requests/sent', {
        params: searchQuery ? { searchQuery } : undefined,
      });
      return response.data.SentRequests;
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
      const response = await axiosInstance.get('/friends/available', {
        params: {
          ...(searchQuery ? { searchQuery } : {}),
          page,
          limit,
        },
      });
      return response.data.AvailableUsers;
    },
  });

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(`/friends/request/send/${userId}`);
      return response.data.request;
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
      const response = await axiosInstance.post(`/friends/request/accept/${requestId}`);
      return response.data.message;
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
      const response = await axiosInstance.post(`/friends/request/rejects/${requestId}`);
      return response.data.message;
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
      return response.data.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });
};
