'use client';
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent } from '@workspace/ui/components/sheet';
import { useFriends } from '@/services/game/friends/hooks/use-friends';
import ChatWindow from './chat-window';
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemGroup,
} from '@workspace/ui/components/item';
import Image from 'next/image';
import type { User } from '@/services/game/types/user';

const ChatSheet = ({ children }: { children: React.ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: friends = [] } = useFriends({ searchQuery: searchQuery || undefined });
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>('');
  const selectedFriend: User | undefined = friends.find((f) => f.id === selectedReceiverId);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        {!selectedReceiverId ? (
          <div className="h-full border-r flex flex-col">
            <div className="p-4 border-b flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Friends</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends..."
                className="mt-2 px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="overflow-y-auto flex-1">
              {friends.length === 0 ? (
                <div className="p-4 text-muted-foreground text-sm">You have no friends yet.</div>
              ) : (
                <ItemGroup className="divide-y">
                  {friends.map((friend) => (
                    <Item
                      key={friend.id}
                      role="button"
                      tabIndex={0}
                      className={selectedReceiverId === friend.id ? 'bg-muted' : undefined}
                      onClick={() => setSelectedReceiverId(friend.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setSelectedReceiverId(friend.id);
                      }}
                    >
                      <ItemMedia variant="image">
                        <Image
                          src={friend.image ?? undefined}
                          alt={friend.name ?? 'User'}
                          className="rounded-full"
                          width={100}
                          height={100}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{friend.name ?? 'Unknown'}</ItemTitle>
                        <ItemDescription>{friend.email ?? ''}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </ItemGroup>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 min-w-0">
            <ChatWindow
              receiver={selectedFriend!}
              receiverId={selectedReceiverId}
              setSelectedReceiverId={setSelectedReceiverId}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export { ChatSheet };
