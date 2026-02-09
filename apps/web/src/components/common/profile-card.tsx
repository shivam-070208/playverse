'use client';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@workspace/ui/components/item';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { authClient } from '@/lib/auth-client';
import { Badge } from '@workspace/ui/components/badge';
const ProfileCard = () => {
  const { data } = authClient.useSession();
  if (!data || !data?.user) return null;
  return (
    <Item>
      <ItemMedia>
        <Avatar size="lg">
          <AvatarImage src={data.user?.image || '/user-placeholder.png'} alt="avatar-user" />
          <AvatarFallback>{data.user?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex items-center gap-1">
          {data.user.name}
          <Badge variant={data.user.emailVerified ? 'link' : 'destructive'}>
            {data.user.emailVerified ? 'Verified' : 'UnVerified'}
          </Badge>
        </ItemTitle>
        <ItemDescription>{data.user.email}</ItemDescription>
      </ItemContent>
    </Item>
  );
};

export { ProfileCard };
