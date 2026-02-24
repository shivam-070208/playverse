import React, { ReactNode } from 'react';

type ChatWindowProps = {
  children: ReactNode;
};

const ChatWindow: React.FC<ChatWindowProps> = ({ children }) => {
  return <div>{children}</div>;
};

export default ChatWindow;
