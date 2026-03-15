'use client';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useChatMessage } from '@/services/game/lobby/hooks/use-chat';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import type { User } from '@/services/game/types/user';
import { authClient } from '@/lib/auth-client';

interface Props {
  receiverId: string;
  setSelectedReceiverId: Dispatch<SetStateAction<string>>;
  receiver: User;
}

const ChatWindow = ({ receiverId, receiver, setSelectedReceiverId }: Props) => {
  const { data: messages = [], isLoading } = useChatMessage(receiverId);
  const [inputValue, setInputValue] = useState('');
  const { data: currentUser } = authClient.useSession();
  const currentUserId = currentUser?.user.id;

  // Send message handler (to implement)
  const handleSend = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    // TODO: Send message logic
    setInputValue('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-background/80">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b bg-background/80 gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="mr-1"
          onClick={() => setSelectedReceiverId('')}
        >
          <FaArrowLeft size={20} />
        </Button>
        <Avatar>
          {receiver.image ? (
            <AvatarImage src={receiver.image} alt={receiver.name ?? 'User'} />
          ) : (
            <AvatarFallback>
              {receiver.name ? receiver.name.slice(0, 2).toUpperCase() : 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="ml-2 flex flex-col">
          <span className="font-semibold text-base">{receiver.name ?? 'Unknown'}</span>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 p-4 overflow-y-auto bg-background space-y-2">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center">No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] shadow ${
                  message.senderId === currentUserId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <span className="block">{message.data.text}</span>
                <span className="block text-xs text-muted-foreground mt-1 text-right">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form className="flex items-center px-4 py-3 border-t gap-2 w-full " onSubmit={handleSend}>
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          type="submit"
          className="flex-shrink-0"
          disabled={!inputValue.trim()}
          onClick={handleSend}
          variant="ghost"
        >
          <FaPaperPlane size={18} className="text-primary" />
        </Button>
      </form>
    </div>
  );
};

export default ChatWindow;
