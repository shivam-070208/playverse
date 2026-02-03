'use client';
import { Container } from '@/components/common/container';
import { authClient } from '@/lib/auth-client';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@workspace/ui/components/item';
import { Avatar, AvatarImage, AvatarFallback } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { FcSettings } from 'react-icons/fc';
import { FaUserFriends, FaMailBulk } from 'react-icons/fa';
import Link from 'next/link';
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

const LobbyHeader = () => {
  const actionsMap = [
    {
      icon: FcSettings,
      href: '/settings',
      title: 'Setting',
    },
    {
      icon: FaUserFriends,
      href: '/friends',
      title: 'Friends',
    },
    {
      icon: FaMailBulk,
      href: '/notification',
      title: 'Notification/Mail',
    },
  ];
  return (
    <Container maxWidth="full" className="flex justify-between items-center" as="header">
      <div className="profile">
        <ProfileCard />
      </div>
      <div className="actions flex gap-2">
        {actionsMap.map((action, index) => {
          const Icon = action.icon as React.ElementType;
          return (
            <Link href={action.href} key={`header-actions-${action.href}-${index}`}>
              <Tooltip>
                <TooltipContent>{action.title}</TooltipContent>
                <TooltipTrigger>
                  <Icon size={20} />
                </TooltipTrigger>
              </Tooltip>
            </Link>
          );
        })}
      </div>
    </Container>
  );
};

export { LobbyHeader };
