'use client';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useChatMessage } from '@/services/game/lobby/hooks/use-chat';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import type { User } from '@/services/game/types/user';
import type { ChatMessage } from '@/services/game/types/messages';
import { authClient } from '@/lib/auth-client';
import { useSocketContextValues } from '@/components/providers/socket-provider';
import { SocketEvents } from '@workspace/config';

type IncomingSocketPayload =
  | {
      event?: string;
      data?: { to?: string; from?: string; text?: string; [k: string]: unknown };
    }
  | string;

interface Props {
  receiverId: string;
  setSelectedReceiverId: Dispatch<SetStateAction<string>>;
  receiver: User;
}

const ChatWindow = ({ receiverId, receiver, setSelectedReceiverId }: Props) => {
  const { data: messages = [], isLoading } = useChatMessage(receiverId);
  const [inputValue, setInputValue] = useState('');
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const { data: currentUser } = authClient.useSession();
  const currentUserId = currentUser?.user.id;
  const { socket } = useSocketContextValues();

  useEffect(() => {
    if (!socket) return;

    const handler = (event: MessageEvent) => {
      let parsed: IncomingSocketPayload;
      try {
        parsed = JSON.parse(event.data);
      } catch {
        parsed = event.data as string;
      }

      if (typeof parsed === 'string') return;
      if (parsed.event !== SocketEvents.CHAT_MESSAGE_SENT) return;

      const data = parsed.data;
      if (!data) return;

      const to = String(data.to ?? '');
      const from = String(data.from ?? '');
      const text = typeof data.text === 'string' ? data.text : '';

      if (!text) return;

      const isForThisChat =
        !!currentUserId &&
        ((to === receiverId && from === currentUserId) ||
          (to === currentUserId && from === receiverId));
      if (!isForThisChat) return;

      setLiveMessages((prev) => [
        ...prev,
        {
          id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
          senderId: from || receiverId,
          receiverId: to || currentUserId || receiverId,
          data: { text },
          status: 'RECEIVED',
          isEdited: false,
          chatId: 'live',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    };

    socket.addEventListener('message', handler);
    return () => {
      socket.removeEventListener('message', handler);
    };
  }, [socket, receiverId, currentUserId]);

  const allMessages = useMemo(() => {
    const combined = [...messages, ...liveMessages];
    combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    return combined;
  }, [messages, liveMessages]);

  const handleSend = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    if (!currentUserId) return;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    console.log('Sending message');
    const payload = {
      event: SocketEvents.CHAT_MESSAGE_SENT,
      data: {
        from: currentUserId,
        to: receiverId,
        text,
      },
    };

    try {
      socket.send(JSON.stringify(payload));
    } catch {
      return;
    }

    setInputValue('');
    setLiveMessages((prev) => [
      ...prev,
      {
        id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        senderId: currentUserId,
        receiverId,
        data: { text },
        status: 'SENT',
        isEdited: false,
        chatId: 'live',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
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
        ) : allMessages.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center">No messages yet.</div>
        ) : (
          allMessages.map((message) => (
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
