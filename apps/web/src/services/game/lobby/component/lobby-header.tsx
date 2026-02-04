import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { FcSettings } from 'react-icons/fc';
import { FaUserFriends, FaMailBulk } from 'react-icons/fa';
import Link from 'next/link';
import { Header } from '@/components/common/header';
import { Fragment } from 'react';

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
    <Header>
      <Fragment>
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
      </Fragment>
    </Header>
  );
};

export { LobbyHeader };
