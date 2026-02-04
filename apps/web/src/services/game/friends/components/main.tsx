import { Container } from '@/components/common/container';
import { EntityContainer, EntityContent, EntityHeader } from '@/components/common/entity-layout';
import { FriendTable } from './friend-table';

const Friends = () => {
  return (
    <Container className="relative flex-1 mt-8" maxWidth="5xl" padding="sm" as="main">
      <EntityContainer>
        <EntityHeader>
          {/* 
          TODO:
          Add a add friend button
        */}
        </EntityHeader>
        <EntityContent>
          <FriendTable />
        </EntityContent>
      </EntityContainer>
    </Container>
  );
};

export default Friends;
