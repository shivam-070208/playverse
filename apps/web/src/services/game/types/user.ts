export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  status: 'OFFLINE' | 'ONLINE' | string;
  createdAt: string;
  updatedAt: string;
}
