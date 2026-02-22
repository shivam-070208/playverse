'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useFriends } from '../hooks/use-friends';

const FriendTable = () => {
  const { data: friends, isLoading, error } = useFriends();

  if (isLoading) {
    return (
      <div className="w-full mt-4">
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12 mb-2" />
        <Skeleton className="w-full h-12" />
      </div>
    );
  }

  if (error) {
    return <div className="text-destructive text-sm py-4">Failed to load friends.</div>;
  }

  if (!friends || friends.length === 0) {
    return <div className="text-muted-foreground text-sm py-4">No friends found.</div>;
  }

  return (
    <div className="w-full mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {friends.map((friend) => (
            <TableRow key={friend.id}>
              <TableCell>{friend.name}</TableCell>
              <TableCell>{friend.email}</TableCell>
              <TableCell>{friend.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { FriendTable };
