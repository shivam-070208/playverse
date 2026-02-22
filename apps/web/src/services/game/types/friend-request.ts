import { User } from './user';

export enum FriendRequestStatus {
  PENDING,
  ACCEPTED,
  REJECTED,
}

export interface FriendRequest {
  id: string;
  createdAt: Date;
  status: FriendRequestStatus;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
}
