"use client";

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { type StoreApi, useStore } from "zustand";
import {
  type UserDataStore,
  createUserDataStore,
  defaultUserStoreData,
  initUserDataStore,
} from "@/lib/stores/user/userStore";

export const UserDataStoreContext =
  createContext<StoreApi<UserDataStore> | null>(null);

export interface UserDataStoreProviderProps {
  children: ReactNode;
}

export const UserDataStoreProvider = ({
  children,
}: UserDataStoreProviderProps) => {
  const storeRef = useRef<StoreApi<UserDataStore>>();

  if (!storeRef.current) {
    storeRef.current = createUserDataStore(defaultUserStoreData);
  }

  useEffect(() => {
    initUserDataStore().then((data) => {
      storeRef.current?.setState(data);
    });
  }, []);

  return (
    <UserDataStoreContext.Provider value={storeRef.current}>
      {children}
    </UserDataStoreContext.Provider>
  );
};

export const useUserDataStore = <T,>(
  selector: (store: UserDataStore) => T
): T => {
  const counterStoreContext = useContext(UserDataStoreContext);

  if (!counterStoreContext) {
    throw new Error(
      `useUserDataStore must be use within UserDataStoreProvider`
    );
  }

  return useStore(counterStoreContext, selector);
};
