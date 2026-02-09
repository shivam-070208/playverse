import { Container } from '@/components/common/container';
import { EntityContainer, EntityContent, EntityHeader } from '@/components/common/entity-layout';
import { FriendTable } from './friend-table';
import { AddFriendButton } from './add-friend';
import { ViewApplicationsButton } from './view-application';

const Friends = () => {
  return (
    <Container className="relative flex-1 mt-8" maxWidth="5xl" padding="sm" as="main">
      <EntityContainer>
        <EntityHeader>
          <div className="flex gap-2">
            <AddFriendButton />
            <ViewApplicationsButton />
          </div>
        </EntityHeader>
        <EntityContent>
          <FriendTable />
        </EntityContent>
      </EntityContainer>
    </Container>
  );
};

export default Friends;
