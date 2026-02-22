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

import { useAcceptFriendRequest, useReceivedFriendRequests } from '../hooks/use-friends';
import { useRouter } from 'next/navigation';

const ViewApplicationsButton: React.FC = () => {
  const { data: requests = [], isLoading, isError } = useReceivedFriendRequests();
  const router = useRouter();

  const acceptFriendRequest = useAcceptFriendRequest();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          View Applications
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Received Friend Requests</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">Loading applications...</div>
        ) : isError ? (
          <div className="p-4 text-sm text-destructive">Error loading applications.</div>
        ) : !requests || requests.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">No friend requests received.</div>
        ) : (
          <div className="max-h-[50vh] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.fromUser?.name || 'Unknown'}</TableCell>
                    <TableCell>{request.fromUser?.email || '-'}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/profile/${request.fromUser?.id}`)}
                        disabled={!request.fromUser?.id}
                      >
                        View Profile
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={acceptFriendRequest.isPending}
                        onClick={() => acceptFriendRequest.mutate(request.id)}
                      >
                        {acceptFriendRequest.isPending ? 'Accepting...' : 'Accept'}
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

export { ViewApplicationsButton };
