import { User } from './user';

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  createdAt: string;
  friend: User;
}
