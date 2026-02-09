'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { useRouter } from 'next/navigation';

import { useAvailableUsers, useSendFriendRequest } from '../hooks/use-friends';
import { useEffect, useState } from 'react';

const AddFriendButton: React.FC = () => {
  const router = useRouter();
  // Query all available users (can add pagination later if desired)
  const { data: users = [], isLoading, isError } = useAvailableUsers({ page: 1, limit: 25 });

  const {
    mutate: sendRequest,
    isPending: isSending,
    variables,
    isSuccess,
  } = useSendFriendRequest();
  const [requestedMap, setRequestedMap] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    if (isSuccess && variables) {
      setRequestedMap((prev) => ({ ...prev, [variables]: true }));
    }
  }, [isSuccess, variables]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Available Users</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading available friends...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">Error loading users.</div>
        ) : !users || users.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No users available to add.</div>
        ) : (
          <div className="max-h-[50vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Profile</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant={requestedMap[user.id] ? 'outline' : 'secondary'}
                        disabled={!!requestedMap[user.id] || isSending}
                        onClick={() => sendRequest(user.id)}
                      >
                        {requestedMap[user.id]
                          ? 'Requested'
                          : isSending && variables === user.id
                            ? 'Sending...'
                            : 'Add'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/profile/${user.id}`)}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
};

export { AddFriendButton };
