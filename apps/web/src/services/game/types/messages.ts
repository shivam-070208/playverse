export type MessageStatus = 'FAILED' | 'SENT' | 'RECEIVED' | 'READ';

export type MessageData = {
  text?: string;
  [key: string]: unknown;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  data: MessageData;
  status: MessageStatus;
  isEdited: boolean;
  chatId: string;
  createdAt: string;
  updatedAt: string;
};
