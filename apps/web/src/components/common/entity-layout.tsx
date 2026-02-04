'use client';

import { Input } from '@workspace/ui/components/input';
import React, { createContext, useState, Dispatch, SetStateAction, useContext } from 'react';

type EntityContextType = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const EntityContext = createContext<EntityContextType>({
  search: '',
  setSearch: () => {},
});

//* Hooks
/**
 * Custom hook to access EntityContext values.
 *
 * !@note Throws an error if used outside of an EntityContext.Provider.
 */
export const useEntityValues = (): EntityContextType => {
  const context = useContext(EntityContext);
  if (context === undefined) {
    throw new Error('useEntityValues must be used within an EntityContext.Provider');
  }
  return context;
};

const EntityContainer = ({ children }: { children: React.ReactNode }) => {
  const [search, setSearch] = useState<string>('');
  return (
    <EntityContext.Provider value={{ search, setSearch }}>
      <div className="flex flex-col w-full h-full">{children}</div>
    </EntityContext.Provider>
  );
};
/**
 * * Actions can be passed to this for entity like addd , delete or else where
 */
const EntityHeader = ({
  children,
  placeholder = 'search entity ',
}: {
  children?: React.ReactNode;
  placeholder?: string;
}) => {
  const { search, setSearch } = useEntityValues();
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="flex  w-full  justify-between items-center">
      <div className="search ">
        <Input
          placeholder={placeholder}
          className="w-[20vw] rounded-none min-w-60"
          type="text"
          value={search}
          onChange={onQueryChange}
        />
      </div>
      <div className="entity-action">{children}</div>
    </div>
  );
};

const EntityContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="entity-content flex-1 w-full">{children}</div>;
};

export { EntityContext, EntityContainer, EntityHeader, EntityContent };
